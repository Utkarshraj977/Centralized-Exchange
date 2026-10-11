import type { Request, Response } from "express";
import { balanceCreateService, balanceUpdateService, balanceGetService, balanceAddService } from "./balance.service";
import type {
    balanceCreateInterface,
    balanceUpdateInterface
} from "./balance.types";
import { Asset } from "../../../generated/prisma/enums";
import { Prisma } from "../../../generated/prisma/browser";

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
    res.status(200).json({ data: balance, message: "balance fetched successfully" });
}

export const balanceAdd = async (req: Request, res: Response) => {
    try {
        let { asset, balance } = req.body;
        if (!asset || balance <= 0 || typeof balance !== "number") throw new Error("data must be required");
        const userid = req.params.userid;
        if (!userid || typeof userid !== "string") return res.status(400).json({ data: null, message: "userid not found" });
        if (!Object.values(Asset).includes(asset as Asset)) {
            return res.status(400).json({ message: "Invalid asset" });
        }
        balance = new Prisma.Decimal(balance);
        const bal = await balanceAddService(asset as Asset, balance, userid);
        res.status(200).json({ data: bal, message: "balance fetched successfully" });
    } catch (error) {
        res.status(500).json({ data: null, message: "something went wrong" })
    }
}

