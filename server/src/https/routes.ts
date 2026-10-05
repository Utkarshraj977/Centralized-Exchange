import { authMiddleWare } from "../middleware/auth.middleware";
import {googlelogin,googlelogout} from "./controllers/auth.controller"
import { Router } from "express"

const router=Router();

router.post("/auth/login",googlelogin);
router.get("/auth/logout",authMiddleWare,googlelogout);

export default router;
