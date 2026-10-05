
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client();
import { env } from "../../config/env";
import { prisma } from "../../config/db";
import { randomBytes, createHash } from "node:crypto";
import {initializeUser} from "../onboarding/onboarding.service";


export const googleloginservice = async (credential: string): Promise<string> => {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: env.CLIENTID });
    const payload = ticket.getPayload();
    if (!payload) throw new Error("invalid sessiontoken");

    const userid = payload['sub'];
    const email = payload['email'];
    const lastname = payload['family_name'] ?? "";
    const firstname = payload['given_name'];

    if (!userid || !email || !firstname) throw new Error("email or firstname required.");


    let user;
    //check in db
    user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    })
    if (!user) {
        await initializeUser(userid,firstname,lastname,email);
    }

    const token = randomBytes(32).toString("hex");
    if (!token) throw new Error("token generation failed");

    user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    })
    if(!user) throw new Error("user not found");
    
    const hashedtoken = createHash("sha256").update(token).digest("hex");
    const newsession = await prisma.session.create({
        data: {
            tokenHash: hashedtoken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
        }
    })

    if (!newsession) throw new Error("session generation failed")
    return token;
}

export const googlelogoutservice = async (token: string) => {
    const hashedtoken = createHash("sha256").update(token).digest("hex");
    const deleted_sesion = await prisma.session.delete({
        where: { tokenHash: hashedtoken }
    });
}

