import express from "express";
import { handleKakaoCallback } from "./userController";

const userRouter = express.Router();
userRouter.get('/auth/kakao/callback',handleKakaoCallback); //카카오 로그인 API


export default userRouter;