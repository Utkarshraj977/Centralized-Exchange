import type { releaseBalanceInterface, reserveBalaceInterface } from "./reservation.types"
import { Prisma } from "../../../generated/prisma/client";
import { ledgerCreateService } from "../ledger/ledger.service";
import { Asset } from "../../../generated/prisma/enums";

type BalanceRow = {
    id: string;
    walletId: string;
    asset: Asset;
    available: Prisma.Decimal;
    reserved: Prisma.Decimal;
    createdAt: Date;
    updatedAt: Date;
};

export const reserveBalance = async (data: reserveBalaceInterface,tx:Prisma.TransactionClient) => {
  
    const balances=await tx.$queryRaw<BalanceRow[]>`select * from "balance" where "walletId"=${data.walletId} and "asset"=${data.asset} for update`;

    let balance=balances[0];
    if(!balance) throw new Error("balance not found");
    let res_val=Prisma.Decimal(data.reservalue);
    if(balance.available.lessThan(res_val)) throw new Error("Invalid reserved value.");

    const new_balance = await tx.balance.update({
        where: {
            walletId_asset: {
                walletId: data.walletId,
                asset: data.asset
            }
        },
        data:{
            available:balance.available.minus(res_val),
            reserved:balance.reserved.plus(res_val)
        }
    })

    const ledger= await ledgerCreateService({walletId:data.walletId,asset:data.asset,amount:(res_val).negated(),type:"RESERVATION",referenceId:data.orderId},tx);
    return {ledger,new_balance};
}

export const releaseBalance = async (data: releaseBalanceInterface,tx:Prisma.TransactionClient) => {
    const balances=await tx.$queryRaw<BalanceRow[]>`select * from "balance" where "walletId"=${data.walletId} and "asset"=${data.asset} for update`;
    let balance=balances[0];
    if(!balance) throw new Error("balace not found");
    const relval=Prisma.Decimal(data.releasevalue);
    if(balance.reserved.lessThan(relval)) throw new Error("invalid release value.");

    const new_balance=await tx.balance.update({
        where:{
            walletId_asset:{
                walletId:data.walletId,
                asset:data.asset
            }
        },
        data:{
            available:balance.available.plus(relval),
            reserved:balance.reserved.minus(relval)
        }
    })
    const ledger= await ledgerCreateService({walletId:data.walletId,asset:data.asset,amount:relval,type:"RELEASE",referenceId:data.orderId},tx);

    return {new_balance,ledger};
}
