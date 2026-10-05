import { prisma } from "../../config/db"
import type { ledgerCreateInterface, ledgerFindAllInterface, } from "./ledger.types"
import {  LedgerType } from "../../../generated/prisma/enums"
import type { Prisma } from "../../../generated/prisma/client"


export const ledgerCreateService = async (data: ledgerCreateInterface,tx?:Prisma.TransactionClient) => {
    const db=tx ?? prisma;
    const ledger = await db.ledgerEntry.create({
        data: {
            walletId: data.walletId,
            asset: data.asset,
            amount: data.amount,
            type: data.type,
            referenceId:data.referenceId ?? ""
        }
    })
    return ledger;
}

//Get All LedgerEntry feom wallet+assest
export const ledgerGetAllService = async (data: ledgerFindAllInterface) => {
    const ledger = await prisma.ledgerEntry.findMany({
        where: {
            walletId: data.walletId,
            asset: data.asset
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    return ledger;
}

//Get Ledger by id
export const ledgerGetbyIdService = async (id:string) => {
    const ledger=await prisma.ledgerEntry.findUnique({
        where:{
           id:id
        }
    })
    return ledger;
}

