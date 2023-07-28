import express from "express";
import { loginController, stickerController, nqnaController, mainController} from "./userController";
import { jwtMiddleware } from "../../../config/jwtMiddleware.js";

const userRouter = express.Router();

// 로그인 관련
userRouter.get('/auth/kakao/callback',loginController.kakao); //카카오 로그인 API
userRouter.get('/auth/google/callback',loginController.google); //구글 로그인 API

// 페이지 관련
userRouter.get('/:nickname',jwtMiddleware,mainController.getAll); //메인 페이지 조회
userRouter.patch('/:nickname/message',jwtMiddleware,stickerController.postMessage); //메세지 등록(Host, Visitor)
userRouter.get('/visitor_sticker/:visitor_sticker_id',stickerController.getSticker); //방문자 기록 visitor_sticker_id로 상세 조회 API
userRouter.get("/:nickname/sticker",jwtMiddleware,stickerController.getStickers); //방문자 기록 페이지 조회

// 스티커 관련
// userRouter.post('/:nickname/sticker',stickerController.hostSticker); //Host 스티커 등록
// userRouter.post('/:nickname/stickers/new',jwtMiddleware,stickerController.visitorSticker); //Visitor 스티커 등록
userRouter.post('/:nickname/sticker',jwtMiddleware,stickerController.postSticker); //스티커 등록(Host,Visitor)
userRouter.patch('/:nickname/sticker',jwtMiddleware,stickerController.attachSticker); //스티커 부착, 스티머 위치 수정도 같은 API 호출


// nQnA 관련
userRouter.post('/host/:nickname/default_q',nqnaController.postDefaultQuestion); //default 질문 등록 API
userRouter.patch('/host/:nickname/answer/:nQnA_id',nqnaController.postAnswer); //Host 답변 등록 API
userRouter.post('/host/:nickname/visitor_q',nqnaController.postVisitorQuestion); //Visitor 질문 등록 API
userRouter.get('/:nickname/nQnA',jwtMiddleware,nqnaController.getnQnA); //N문 N답 조회 API



export default userRouter;


