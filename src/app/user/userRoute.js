import express from "express";
import { loginController, stickerController, nqnaController, mainController  } from "./userController";
import { jwtMiddleware } from "../../../config/jwtMiddleware.js";

const userRouter = express.Router();
userRouter.get('/auth/kakao/callback',loginController.kakao); //카카오 로그인 API
userRouter.get('/auth/google/callback',loginController.google); //구글 로그인 API

userRouter.get('/visitor_sticker/:visitor_sticker_id',stickerController.getSticker); //방문자 기록 visitor_sticker_id로 상세 조회 API
userRouter.get("/:nickname/sticker",jwtMiddleware,stickerController.getStickers); //방문자 기록 페이지 조회
// userRouter.post('/:nickname/sticker',stickerController.hostSticker); //Host 스티커 등록
// userRouter.post('/:nickname/stickers/new',jwtMiddleware,stickerController.visitorSticker); //Visitor 스티커 등록
userRouter.post('/:nickname/sticker',jwtMiddleware,stickerController.postSticker); //스티커 등록(Host,Visitor)


userRouter.get('/default_q',nqnaController.getDefaultQuestions); //default 질문 전체 조회 API (전체 조회 + 개별 조회)
userRouter.post('/host/:user_id/default_q',nqnaController.postDefaultQuestion); //default 질문 등록 API

userRouter.get('/:nickname',jwtMiddleware,mainController.getAll); //메인 페이지 조회


export default userRouter;
