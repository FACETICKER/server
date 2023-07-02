import express from "express";
import {handleKakaoCallback} from "./userController.js";

const authRouter = express.Router();

authRouter.get('/kakao/callback',handleKakaoCallback); //카카오 로그인 경로





export default authRouter;