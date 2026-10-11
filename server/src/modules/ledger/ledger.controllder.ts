import type { ledgerCreateInterface, ledgerFindAllInterface } from "./ledger.types"
import { ledgerCreateService, ledgerGetAllbyassetService, ledgerGetAllService, ledgerGetbyIdService } from './ledger.service';
import type { Request, Response } from "express";

export const ledgerGetAll = async (req: Request, res: Response) => {
    const userid=req.userId;
    if (!userid) throw new Error("data not found");
    const ledger = await ledgerGetAllService(req.userId);
    res.status(200).json({ data: ledger, message: "All ledger fetched successfully" });
}

export const ledgerGetAllbyasset = async (req: Request, res: Response) => {
    const {asset} = req.body;
    if (!asset) throw new Error("data not found");
    const userid=req.userId;
    const ledger = await ledgerGetAllbyassetService({asset,id:userid});
    res.status(200).json({ data: ledger, message: "All ledger fetched successfully" });
}

export const ledgerbyid = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "id required" });
    }
    if (typeof id !== "string") {
        return res.status(400).json({ message: "Invalid id" });
    }
    const ledger = await ledgerGetbyIdService(id);
    res.status(200).json({ data: ledger, message: "ledger fetched successfully" });
}

