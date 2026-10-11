import type { Asset } from "../../../generated/prisma/enums";
import type { Decimal } from "../../../generated/prisma/internal/prismaNamespace";


interface reserveBalaceInterface{
    walletId:string,
    asset:Asset,
    reservalue:Decimal,
    orderId: string
}

interface releaseBalanceInterface{
    walletId:string,
    asset:Asset,
    releasevalue:Decimal,
    orderId: string
}

export type {reserveBalaceInterface,releaseBalanceInterface};
