import type { Asset } from "../../../generated/prisma/enums";


interface reserveBalaceInterface{
    walletId:string,
    asset:Asset,
    reservalue:number,
    orderId: string
}

interface releaseBalanceInterface{
    walletId:string,
    asset:Asset,
    releasevalue:number,
    orderId: string
}

export type {reserveBalaceInterface,releaseBalanceInterface};
