import { authMiddleWare,adminMiddleware } from "../middleware/auth.middleware";
import {googlelogin,googlelogout,getProfile} from "../modules/auth/auth.controller"
import { marketCreate, marketDelete, marketGet, marketGetAll } from "../modules/market/market.controller";
import { getWallet } from "../modules/wallet/wallet.controller";
import { Router } from "express"
import { balanceAdd, balanceGet } from "../modules/balance/balance.controller";
import { ledgerbyid, ledgerGetAll, ledgerGetAllbyasset } from "../modules/ledger/ledger.controllder";
import { cancelOrder, createOrder, getAllOrder, getOrderById } from "../modules/order/order.controller";

const router=Router();

//auth
router.post("/auth/login",googlelogin);
router.get("/auth/logout",authMiddleWare,googlelogout);
router.get("/auth/get",authMiddleWare,getProfile);

//market
router.post("/market/create",authMiddleWare,adminMiddleware,marketCreate);
router.delete("/market/delete",authMiddleWare,adminMiddleware,marketDelete);
router.get("/market/getbysymbol",marketGet);
router.get("/market/getall",marketGetAll);

//balance
router.get("/balance/get",authMiddleWare,balanceGet);
router.post("/balance/deposit/:userid",authMiddleWare,adminMiddleware,balanceAdd);

//ledger
router.post("/ledger/getAllbyAsset",authMiddleWare,ledgerGetAllbyasset);
router.get("/ledger/getAll",authMiddleWare,ledgerGetAll);
router.get("/ledger/getbyid/:id",authMiddleWare,ledgerbyid);

//order
router.post("/order/createorder/:marketId",authMiddleWare,createOrder);
router.delete("/order/cancelorder/:marketId/:orderId",authMiddleWare,cancelOrder);
router.get("/order/getAll/:marketId",authMiddleWare,getAllOrder);
router.get("/order/getorderbyid/:marketId/:orderId",authMiddleWare,getOrderById);


//wallet
router.get("/wallet/getwallet",authMiddleWare,getWallet);



export default router;
