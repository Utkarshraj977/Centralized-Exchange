import { createOrderService, cancelOrderService, getOrderByIdService, getAllOrderService } from "./order.service"
import type { Request, Response } from "express"
import { OrderStatus, CreatedType, OrderSide, OrderType } from "../../../generated/prisma/enums";
import { Prisma } from "../../../generated/prisma/client";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { side, type, quantity, price, quoteAmount } = req.body;
        const { marketId } = req.params;
        const userId = req.userId;

        if (!userId || typeof userId !== "string" || typeof marketId !== "string") {
            return res.status(400).json({ message: "Invalid user or market" });
        }
 
        if (
            !Object.values(OrderSide).includes(side) ||
            !Object.values(OrderType).includes(type)
        ) {
            return res.status(400).json({ message: "Invalid side or type" });
        }

        const isPositive = (value: unknown): boolean =>
            (typeof value === "string" || typeof value === "number") && value !== "" && Number.isFinite(Number(value)) && Number(value) > 0;

        if (!isPositive(quantity)) {
            return res.status(400).json({ message: "Quantity must be positive" });
        }

        if (type === OrderType.LIMIT && !isPositive(price)) {
            return res.status(400).json({ message: "A positive price is required for limit orders" });
        }

        if (
            type === OrderType.MARKET &&
            side === OrderSide.BUY &&
            !isPositive(quoteAmount)
        ) {
            return res.status(400).json({ message: "A positive quoteAmount is required for market buys" });
        }

        const data = {
            userId,
            marketId,
            side,
            type,
            quantity: new Prisma.Decimal(quantity),
            price: isPositive(price) ? new Prisma.Decimal(price) : undefined,
            quoteAmount: isPositive(quoteAmount)
                ? new Prisma.Decimal(quoteAmount)
                : undefined,
            remainingQuantity: new Prisma.Decimal(quantity),
            status: OrderStatus.OPEN,
            createdType: CreatedType.HUMAN,
            remainQuoteAmount: isPositive(quoteAmount)
                ? new Prisma.Decimal(quoteAmount)
                : undefined
        };

        const order = await createOrderService(data);

        return res.status(201).json({
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        console.error("Create order failed:", error);
        return res.status(500).json({ message: "Failed to create order" });
    }
};

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { marketId, orderId } = req.params;

        if (!marketId || !orderId) return res.status(400).json({ message: "marketid or orderid not found" });
        if (typeof marketId !== "string" || typeof orderId !== "string") {
            return res.status(400).json({ message: "Invalid params" });
        }

        const data = { userId, marketId, orderId };
        const cancelorders = await cancelOrderService(data);

        if (!cancelorders) return res.status(400).json({ data: null, message: "order does not cancel" });
        res.status(200).json({ data: cancelorders, message: "order cancel successfully" });
    } catch (error) {
        console.error("Order Cancelation failed:", error);
        return res.status(500).json({ message: "Failed to cancel order" });
    }
}

export const getAllOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { marketId } = req.params;
        if (!marketId) return res.status(400).json({ data: null, message: "marketid doesnt fetched" })

        if (typeof marketId !== "string" || typeof userId !== "string") {
            return res.status(400).json({ message: "Invalid params" });
        }
        const allorder = await getAllOrderService({ userId, marketId });
        if (!allorder) return res.status(400).json({ data: null, message: "order not found" });
        return res.status(200).json({ data: allorder, message: "order fetched successfully" });
    } catch (error) {
        console.error("Create order failed:", error);
        return res.status(500).json({ message: "Failed to fetch order" });
    }

}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const { marketId, orderId } = req.params;

        if (!marketId || !orderId) return res.status(400).json({ "message": "marketid or orderid not found" });
        if (typeof marketId !== "string" || typeof orderId !== "string") {
            return res.status(400).json({ message: "Invalid params" });
        }

        const order = await getOrderByIdService(userId, marketId, orderId);
        if (!order) return res.status(400).json({ data: null, message: "order not found" });
        return res.status(200).json({ data: order, message: "order fetched successfully" });
    } catch (error) {
        console.error("Create order failed:", error);
        return res.status(500).json({ message: "Failed to fetched order" });
    }
}

