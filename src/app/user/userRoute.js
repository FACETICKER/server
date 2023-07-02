import express from "express";
import {handleKakaoCallback} from "./userController.js";

const userRouter = express.Router();

userRouter.get('/auth/kakao/callback',handleKakaoCallback); //카카오 로그인 경로





export default userRouter;