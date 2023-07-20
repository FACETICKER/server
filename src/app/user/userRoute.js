import express from "express";
import { handleKakaoCallback, handleGoogleCallback, getVisitorStickerById, getStickers, postSticker } from "./userController";
import { jwtMiddleware } from "../../../config/jwtMiddleware.js";

const userRouter = express.Router();
userRouter.get('/auth/kakao/callback',handleKakaoCallback); //카카오 로그인 API
userRouter.get('/auth/google/callback',handleGoogleCallback); //구글 로그인 API

userRouter.get('/visitor_sticker/:visitor_sticker_id',getVisitorStickerById); //방문자 기록 visitor_sticker_id로 상세 조회 API

userRouter.get("/:nickname/stickers",jwtMiddleware,getStickers); //방문자 기록 페이지 조회

userRouter.post('/:id/sticker',postSticker); //Host 스티커 등록


export default userRouter;
