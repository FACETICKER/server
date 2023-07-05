import express from "express";
import {handleKakaoCallback, handleGoogleCallback} from "./userController.js";

const userRouter = express.Router();

userRouter.get('/auth/kakao/callback',handleKakaoCallback); //카카오 로그인 API
userRouter.get('/auth/google/callback',handleGoogleCallback); //구글 로그인 API





export default userRouter;