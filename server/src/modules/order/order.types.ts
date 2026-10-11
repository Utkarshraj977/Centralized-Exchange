import { OrderSide,OrderStatus,OrderType,CreatedType } from "../../../generated/prisma/enums"
import { Prisma } from "../../../generated/prisma/client";

interface createOrderInterface {
    userId: string;
    marketId: string;
    side: OrderSide;
    type: OrderType;
    quantity: Prisma.Decimal;
    price?: Prisma.Decimal | undefined;
    quoteAmount?: Prisma.Decimal | undefined;
    remainingQuantity: Prisma.Decimal;
    remainQuoteAmount?:Prisma.Decimal | undefined;
    status: OrderStatus;
    createdType: CreatedType;
}

interface GetOrderInterface{
    id:string,
    userId: string;
    marketId: string;
    side: OrderSide;
    type: OrderType;
    quantity: Prisma.Decimal;
    price?: Prisma.Decimal | null;
    quoteAmount?: Prisma.Decimal | null;
    remainingQuantity?: Prisma.Decimal | null;
    status: OrderStatus;
    createdType: CreatedType;
    remainQuoteAmount:Prisma.Decimal
}

interface cancelOrderInterface{
    userId:string,
    marketId:string,
    orderId:string
}

interface GetAllOrderInputInterface {
    userId: string;
    marketId: string;
}


export type {createOrderInterface,cancelOrderInterface,GetAllOrderInputInterface,GetOrderInterface};