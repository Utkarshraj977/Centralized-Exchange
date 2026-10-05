import "dotenv/config";

if(!process.env.DATABASE_URL){
    throw new Error("DATABASE_URL environment variable is not set");
}
if(!process.env.GOOGLE_CLIENTID) throw new Error("clientid is required");

export const env ={
   DATABASE_URL: process.env.DATABASE_URL,
   CLIENTID: process.env.GOOGLE_CLIENTID,
   CLIENTSECRET:process.env.GOOGLE_CLIENTSECRET,
   PORT:process.env.PORT
} 

