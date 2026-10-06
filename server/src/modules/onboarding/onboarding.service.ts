import { balanceCreateService } from "../balance/balance.service";
import { createWalletService } from "../wallet/wallet.service";
import { prisma } from "../../config/db";
import { Asset,LedgerType } from "../../../generated/prisma/enums";
import { ledgerCreateService } from "../ledger/ledger.service";
import { Prisma } from "../../../generated/prisma/client";

export const initializeUser = async (userid: string, firstname: string, lastname: string, email: string) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    googleId: userid,
                    firstName: firstname,
                    lastName: lastname,
                    email: email
                }
            });
            if (!user) throw new Error("");
            const wallet = await createWalletService(user.id,tx);
            const balanceUSDT = await balanceCreateService(wallet.id, Asset.USDT, 1000, tx);
            const balanceSOL = await balanceCreateService(wallet.id, Asset.SOL, 10, tx);
            const ledger1= await ledgerCreateService({walletId:wallet.id,asset:Asset.SOL,amount:Prisma.Decimal(10),type:LedgerType.DEPOSIT},tx);
            const ledger2= await ledgerCreateService({walletId:wallet.id,asset:Asset.USDT,amount:Prisma.Decimal(1000),type:LedgerType.DEPOSIT},tx);
            return user;
        })
        return result;
    } catch {
        throw new Error("inilization of user failed");
    }
}


