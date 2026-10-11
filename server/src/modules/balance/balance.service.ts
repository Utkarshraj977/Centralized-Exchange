
import { prisma } from "../../config/db";
import { Asset,LedgerType } from "../../../generated/prisma/enums";
import { Prisma } from "../../../generated/prisma/client";
import type { Decimal } from "@prisma/client/runtime/index-browser";
import { ledgerCreateService } from "../ledger/ledger.service";

export const balanceCreateService = async (walletId: string, asset: Asset, value: number, tx?: Prisma.TransactionClient) => {
    const db = tx ?? prisma;

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
        where: {
            walletId_asset: {
                walletId: walletId,
                asset: asset
            }
        },
        data: {
            available: available,
            reserved: reserved
        }
    })

    return new_balance;
}

export const balanceGetService = async (walletId: string, asset: Asset) => {
    const balance = await prisma.balance.findUnique({
        where: {
            walletId_asset: {
                walletId: walletId,
                asset: asset
            }
        }
    })
    return balance;

}


export const balanceAddService = async (asset: Asset, balance: Decimal, userid: string) => {
    const result =await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({
            where: {
                userId: userid
            }
        });
        if (!wallet || typeof wallet.id !== "string") throw new Error("wallet not found");
        const bal = await tx.balance.update({
            where: {
                walletId_asset: {
                    asset: asset,
                    walletId: wallet.id,
                }
            },
            data: {
                available:{
                    increment:balance
                } 
            }
        });
        if (!bal || typeof bal.id !== "string") throw new Error("balance not created");
        const referenceId=crypto.randomUUID();
        await ledgerCreateService({walletId:wallet.id,asset,amount:balance,type:LedgerType.DEPOSIT,referenceId},tx);
        return bal;
    })
    return result;
}

