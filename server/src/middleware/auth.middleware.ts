import { prisma } from "../config/db";
import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from "express";
import { Role } from "../../generated/prisma/enums";
export const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.sessiontoken;
        if (!token) return res.status(401).json({ message: "unauthorized" });

        const hashedtoken = crypto.createHash('sha256').update(token).digest("hex");

        const session = await prisma.session.findUnique({ where: { tokenHash: hashedtoken } });
        if (!session) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (session.expiresAt < new Date()) {
            return res.status(401).json({ message: "session Expired" })
        }
        req.userId = session.userId;
        next();
    } catch {
        return res.status(500).json({ message: "something went wrong" });
    }
}

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },select:{
                role:true
            }
        })
        if (!user) {
            return res.status(401).json({ message: "userid not found" });
        }
        if (user.role !== Role.ADMIN) return res.status(403).json({ message: "user must be admin" });
        next();
    } catch (error) {
        return res.status(500).json({ message: "something went wrong" });
    }
}

