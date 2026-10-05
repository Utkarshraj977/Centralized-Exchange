import { prisma } from "../../config/db";
import { Prisma} from "../../../generated/prisma/client";


export const createWalletService= async(userid:string,tx?:Prisma.TransactionClient)=>{
    const db=tx??prisma;
    const wallet=await db.wallet.create({
        data:{
            userId:userid
        }
    })

    const createdwallet=await db.wallet.findUnique({
        where:{
            userId:userid
        }
    })
    if(!createdwallet){
        throw new Error("wallet not found");
    }
    return createdwallet;
}


export const getWalletService=async (userId:string)=>{
    const wallet=await prisma.wallet.findUnique({
        where:{
            userId:userId
        }
    })
    if(!wallet) throw new Error("wallet not found");
    return wallet;
}

