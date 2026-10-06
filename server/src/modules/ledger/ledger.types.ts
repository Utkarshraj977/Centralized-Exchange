import { Asset,LedgerType } from "../../../generated/prisma/enums"
import type { Prisma } from "../../../generated/prisma/client";

interface ledgerCreateInterface{
    walletId:string,
    asset:Asset
    amount:Prisma.Decimal,
    type:LedgerType,
    referenceId?:string
}

interface ledgerFindAllInterface{
    walletId:string,
    asset:Asset
}



export type {ledgerCreateInterface,ledgerFindAllInterface};