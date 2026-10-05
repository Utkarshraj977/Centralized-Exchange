import type { ledgerCreateInterface, ledgerFindAllInterface } from "./ledger.types"
import { ledgerCreateService, ledgerGetAllService, ledgerGetbyIdService } from './ledger.service';
import type { Request, Response } from "express";

export const ledgerGetAll = async (req: Request, res: Response) => {
    const data: ledgerFindAllInterface = req.body;
    if (!data) throw new Error("data not found");
    const ledger = await ledgerGetAllService(data);
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

