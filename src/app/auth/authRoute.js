import express from "express";
import {handleKakaoCallback} from "./authController.js";

const authRouter = express.Router();

authRouter.get('/kakao/callback',handleKakaoCallback);





export default authRouter;