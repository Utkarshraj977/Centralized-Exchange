import type { Request,Response } from "express";
import {createWalletService, getWalletService} from "./wallet.service"

export const createWallet= async(req:Request,res:Response)=>{
    let userid=req.userId;
    const wallet=await createWalletService(userid);

    res.status(201).json({data:wallet,massege:"wallet created succesfully"});
}

export const getWallet=async(req:Request,res:Response)=>{
    let userid=req.userId;
    const wallet=await getWalletService(userid);

    res.status(200).json({data:wallet,message:"wallet found successfully"})
}

