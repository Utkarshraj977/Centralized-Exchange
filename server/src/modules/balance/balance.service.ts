
import { prisma } from "../../config/db";
import { Asset } from "../../../generated/prisma/enums";
import { Prisma } from "../../../generated/prisma/client";

export const balanceCreateService = async (walletId: string, asset: Asset, value: number,tx?:Prisma.TransactionClient) => {
    const db=tx ?? prisma;

    let balance = await db.balance.findUnique({
        where: {
            walletId_asset: {
                walletId: walletId,
                asset: asset
            }
        }
    })
    if (balance) throw new Error("balance allready exist");

    balance = await db.balance.create({
        data: {
            walletId: walletId,
            asset: asset,
            available: value,
            reserved: 0
        }
    })
    return balance;
}


export const balanceUpdateService = async (walletId: string, asset: Asset, available: number, reserved: number) => {
    const balance = await prisma.balance.findUnique({
        where: {
            walletId_asset: {
                walletId: walletId,
                asset: asset
            }
        }
    })
    if (!balance) throw new Error("balance not found")
    const new_balance = await prisma.balance.update({
        where:{
            walletId_asset: {
                walletId: walletId,
                asset: asset
            }
        },
        data:{
            available:available,
            reserved:reserved
        }
    })

    return new_balance;
}

export const balanceGetService =async(walletId:string,asset:Asset)=>{
    const balance=await prisma.balance.findUnique({
        where:{
            walletId_asset:{
                walletId:walletId,
                asset:asset
            }
        }
    })
    return balance;

}
