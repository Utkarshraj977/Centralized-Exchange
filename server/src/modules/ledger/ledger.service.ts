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

//Get All LedgerEntry from userid+assest
export const ledgerGetAllbyassetService = async (data: ledgerFindAllInterface) => {
    const wallet=await prisma.wallet.findUnique({
        where:{
            userId:data.id,
        }
    });
    if(!wallet) throw new Error("wallet not found");

    const ledger = await prisma.ledgerEntry.findMany({
        where: {
            walletId: wallet.id,
            asset: data.asset
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    return ledger;
}

//Get Ledger by id
export const ledgerGetAllService = async (id:string) => {
    const wallet=await prisma.wallet.findUnique({
        where:{
            userId:id
        }
    });
    if(!wallet) throw new Error("wallet not found");

    const ledger = await prisma.ledgerEntry.findMany({
        where: {
            walletId: wallet.id
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

