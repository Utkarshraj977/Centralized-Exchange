import type { Request, Response } from "express";
import { balanceCreateService, balanceUpdateService, balanceGetService } from "./balance.service";
import type {
    balanceCreateInterface,
    balanceUpdateInterface
} from "./balance.types";

export const balanceCreate = async (req: Request, res: Response) => {
    const data: balanceCreateInterface = req.body;
    if (!data) throw new Error("data must be required");

    const balance = await balanceCreateService(data.walletId, data.asset, data.value);
    res.status(201).json({ data: balance, message: "balance created successfully" })
}

export const balanceUpdate = async (req: Request, res: Response) => {
    const data: balanceUpdateInterface = req.body;
    if (!data) throw new Error("data must be required");

    const new_balance = await balanceUpdateService(data.walletId, data.asset, data.available, data.reserved);
    res.status(200).json({ data: new_balance, message: "balance upadted" })
}

export const balanceGet = async (req: Request, res: Response) => {
    const data: balanceCreateInterface = req.body;
    if (!data) throw new Error("data must be required");

    const balance = await balanceGetService(data.walletId, data.asset);
    res.status(200).json({ data: balance, message: "balance fetched successfully" })
}

