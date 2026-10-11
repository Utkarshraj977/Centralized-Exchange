import type { cancelOrderInterface, createOrderInterface, GetAllOrderInputInterface, GetOrderInterface } from "./order.types"
import { prisma } from "../../config/db"
import { releaseBalance, reserveBalance } from "../reservation/reservation.service";
import { OrderSide, OrderStatus, OrderType } from "../../../generated/prisma/enums";


export const createOrderService = async (data: createOrderInterface) => {
    const result = await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({
            where: {
                userId: data.userId
            } 
        });
        const market = await tx.market.findUnique({
            where: {
                id: data.marketId
            }
        });
        if (!wallet) throw new Error("wallet not found");
        if (!market) throw new Error("market not found");

        let reservalue;
        let asset;
        if (data.side === OrderSide.BUY && data.type === OrderType.LIMIT) {
            if (!data.price) throw new Error("price required");
            asset = market.quoteAsset;
            reservalue = data.quantity.times(data.price);
            const order = await tx.order.create({
                data: {
                    userId: data.userId,
                    marketId: data.marketId,
                    status: data.status,
                    createdType: data.createdType,
                    side: data.side,
                    type: data.type,
                    quantity: data.quantity,
                    price: data.price ?? null,
                    remainingQuantity: data.remainingQuantity
                }
            })
            await reserveBalance({ walletId: wallet.id, asset: asset, reservalue: reservalue, orderId: order.id }, tx);
            return order;
        } else if (data.side === OrderSide.SELL && data.type === OrderType.LIMIT) {
            if (!data.price) throw new Error("price required");
            asset = market.baseAsset;
            reservalue = (data.quantity);
            const order = await tx.order.create({
                data: {
                    userId: data.userId,
                    marketId: data.marketId,
                    status: data.status,
                    createdType: data.createdType,
                    side: data.side,
                    type: data.type,
                    quantity: data.quantity,
                    price: data.price,
                    remainingQuantity: data.remainingQuantity
                }
            })
            await reserveBalance({ walletId: wallet.id, asset: asset, reservalue: reservalue, orderId: order.id }, tx);
            return order;
        } else if (data.side === OrderSide.SELL && data.type === OrderType.MARKET) {
            asset = market.baseAsset;
            reservalue = data.quantity;
            const order = await tx.order.create({
                data: {
                    userId: data.userId,
                    marketId: data.marketId,
                    status: data.status,
                    createdType: data.createdType,
                    side: data.side,
                    type: data.type,
                    quantity: data.quantity,
                    remainingQuantity: data.remainingQuantity
                }
            })
            await reserveBalance({ walletId: wallet.id, asset: asset, reservalue: reservalue, orderId: order.id }, tx);
            return order;
        } else if (data.side === OrderSide.BUY && data.type === OrderType.MARKET) {
            if (!data.quoteAmount || !data.remainQuoteAmount) throw new Error("quoteAmount required");

            const order = await tx.order.create({
                data: {
                    userId: data.userId,
                    marketId: data.marketId,
                    status: data.status,
                    createdType: data.createdType,
                    side: data.side,
                    type: data.type,
                    quantity: data.quantity,
                    quoteAmount: data.quoteAmount,
                    remainQuoteAmount: data.remainQuoteAmount,
                    remainingQuantity: data.remainingQuantity
                }
            })
            await reserveBalance({ walletId: wallet.id, asset: market.quoteAsset, reservalue: data.quoteAmount, orderId: order.id }, tx);
            return order;
        } else {
            throw new Error("Invalid order side/type combination");
        }
    })
    return result;
}


export const cancelOrderService = async (data: cancelOrderInterface) => {
    const result = await prisma.$transaction(async (tx) => {
        const orders = await tx.$queryRaw<GetOrderInterface[]>`select * from "Order" where "userId"=${data.userId} AND "marketId"=${data.marketId} AND "id"=${data.orderId} for update`;
        const order = orders[0];
        if (!order) throw new Error("Order not found");
        if (order?.status === OrderStatus.FILLED || order?.status === OrderStatus.CANCELLED) {
            throw new Error("order status invalid");
        }
        const wallet = await tx.wallet.findUnique({
            where: {
                userId: order.userId
            }
        });
        if (!wallet) throw new Error("wallet not found");
        const market = await tx.market.findUnique({
            where: {
                id: data.marketId
            }
        })
        if (!market) throw new Error("market not found");
        if (order.side === OrderSide.BUY && order.type === OrderType.LIMIT) {
            if (!order.price) throw new Error("order price required");
            if (order.price === null) throw new Error("order price required");
            if (!order.remainingQuantity) throw new Error("order remaining quantity required");
            let releasevalue = order.price.times(order.remainingQuantity);
            await releaseBalance({ orderId: order?.id, walletId: wallet.id, asset: market.quoteAsset, releasevalue: releasevalue }, tx);
            const cancelorder = await tx.order.update({
                where: {
                    id: data.orderId
                },
                data: {
                    status: OrderStatus.CANCELLED
                }
            });
            return cancelorder;
        } else if (order.side === OrderSide.SELL && order.type === OrderType.LIMIT) {
            let releasevalue = order.remainingQuantity;
            if (!releasevalue) throw new Error("remain Quantity required for cancellation");
            await releaseBalance({ orderId: order?.id, walletId: wallet.id, asset: market.baseAsset, releasevalue: releasevalue }, tx);
            const cancelorder = await tx.order.update({
                where: {
                    id: data.orderId
                },
                data: {
                    status: OrderStatus.CANCELLED
                }
            });
            return cancelorder;
        } else if (order.side === OrderSide.SELL && order.type === OrderType.MARKET) {
            let releasevalue = order.remainingQuantity;
            if (!releasevalue) throw new Error("remain Quantity required for cancellation");

            await releaseBalance({ orderId: order?.id, walletId: wallet.id, asset: market.baseAsset, releasevalue: releasevalue }, tx);
            const cancelorder = await tx.order.update({
                where: {
                    id: data.orderId
                },
                data: {
                    status: OrderStatus.CANCELLED
                }
            });
            return cancelorder;
        } else if (order.side === OrderSide.BUY && order.type === OrderType.MARKET) {
            if (!order.remainQuoteAmount) throw new Error("order remainQuoteamount required");
            if (order.remainQuoteAmount === null) throw new Error("order remainQuoteAmount required");
            let releasevalue = order.remainQuoteAmount;
            await releaseBalance({ orderId: order?.id, walletId: wallet.id, asset: market.quoteAsset, releasevalue: releasevalue }, tx);
            const cancelorder = await tx.order.update({
                where: {
                    id: data.orderId
                },
                data: {
                    status: OrderStatus.CANCELLED
                }
            });
            return cancelorder;
        } else {
            throw new Error("Invalid order side/type combination");
        }

    })
    return result;
}


export const getAllOrderService = async ({ userId, marketId }: GetAllOrderInputInterface) => {
    const allorder = await prisma.order.findMany({
        where: {
            userId: userId,
            marketId: marketId
        }
    })
    return allorder;
}


export const getOrderByIdService = async (userId: string, marketId: string, orderId: string) => {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId,
            marketId
        }
    })
    return order;
}

