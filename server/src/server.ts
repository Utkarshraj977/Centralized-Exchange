
import http from 'node:http';
import express  from "express";
import {env} from './config/env'
import router from './https/routes';
const app=express();
const server=http.createServer(app);
import cookieParser from "cookie-parser"

app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("server is running")
})

app.use("/api",router);





server.listen(env.PORT,()=>{
    console.log(`server is running on port ${env.PORT}`);
})

