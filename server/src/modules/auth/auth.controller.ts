import type { Request,Response } from "express";
import { googleloginservice,googlelogoutservice} from "./auth.service";


export const googlelogin =async (req:Request,res:Response)=>{
    const credential=req.body.credential;
    if(!credential) return res.status(400).json({message:"credential not found"});

    const token=await googleloginservice(credential);
    return  res.cookie("sessiontoken",token,{httpOnly:true}).json({status:200,message:"login successful"});
}

export const googlelogout=async (req:Request,res:Response)=>{
      await googlelogoutservice(req.cookies.sessiontoken);
      res.clearCookie("sessiontoken");

      return res.status(200).json({message:"logout succesfully"})
}
