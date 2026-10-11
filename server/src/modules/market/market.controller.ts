import type { Request, Response } from "express"
import { Asset } from "../../../generated/prisma/enums";
import { marketCreateService,marketDeleteService,marketGetAllService,marketGetBySymbolService } from "./market.service";

export const marketCreate = async (req: Request, res: Response) => {
    try {
        const { symbol, baseAsset, quoteAsset } = req.body;
        if (!symbol || !baseAsset || !quoteAsset) return res.status(400).json({ data: null, message: "symbol or baseasset or quoteasset missing" });
        if (typeof symbol !== "string") return res.status(400).json({ data: null, message: "type mismatch or invalid data" });
        if (!Object.values(Asset).includes(baseAsset) || !Object.values(Asset).includes(quoteAsset)) {
            return res.status(400).json({ data: null, message: "type mismatch or invalid data" });
        }
        const data = { symbol, baseAsset, quoteAsset };
        const market = await marketCreateService(data);
        if (!market) return res.status(400).json({ data: null, message: "market not cretaed" });
        res.status(201).json({ data: market, message: "market cretaed successfully" });
    } catch {
        return res.status(500).json({data:null,message:"market creation failed"});
    }
}


export const marketGet = async (req: Request, res: Response) => {
    try{
        const {symbol}=req.body;
        if(!symbol || typeof symbol!=="string") return res.status(400).json({data:null,message:"symbol required"});
        const market=await marketGetBySymbolService({symbol});
        res.status(200).json({ data: market, message: "market fetched successfully" });
    }catch{
        return res.status(500).json({data:null,message:"market fetching failed"});
    }
}

export const marketDelete = async (req: Request, res: Response) => {
    try{
        const {symbol}=req.body;
        if(!symbol || typeof symbol!=="string") return res.status(400).json({data:null,message:"symbol required"});
        const market=await marketDeleteService({symbol});
        res.status(200).json({ data: market, message: "market deleted successfully" });
    }catch{
        return res.status(500).json({data:null,message:"market deletion failed"});
    }
}

export const marketGetAll = async (req: Request, res: Response) => {
    try{
        const market=await marketGetAllService();
        res.status(200).json({ data: market, message: "All market fetched successfully" });
    }catch{
        return res.status(500).json({data:null,message:"market fetching failed"});
    }
}
