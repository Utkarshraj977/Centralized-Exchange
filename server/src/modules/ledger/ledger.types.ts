import { Asset,LedgerType } from "../../../generated/prisma/enums"

interface ledgerCreateInterface{
    walletId:string,
    asset:Asset
    amount:number,
    type:LedgerType,
    referenceId?:string
}

interface ledgerFindAllInterface{
    walletId:string,
    asset:Asset
}



export type {ledgerCreateInterface,ledgerFindAllInterface};