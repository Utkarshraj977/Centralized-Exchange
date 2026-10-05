import {prisma} from "../config/db";
import crypto from 'node:crypto';
import type { Request,Response,NextFunction } from "express";

export const authMiddleWare = async (req:Request, res:Response, next:NextFunction) => {
    const token=req.cookies?.sessiontoken;
    if(!token) return res.status(401).json({message:"unauthorized"});

    const hashedtoken=crypto.createHash('sha256').update(token).digest("hex");
    
    const session=await prisma.session.findUnique({where:{tokenHash:hashedtoken}});
    if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if(session.expiresAt < new Date()){
        return res.status(401).json({message:"session Expired"})
    }
    req.userId=session.userId;
    next();
}
 