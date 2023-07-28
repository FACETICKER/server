import express from "express";
import { loginController, stickerController, nqnaController, mainController} from "./userController";
import { jwtMiddleware } from "../../../config/jwtMiddleware.js";

const userRouter = express.Router();

// 로그인 관련
userRouter.get('/auth/kakao/callback',loginController.kakao); //카카오 로그인 API
userRouter.get('/auth/google/callback',loginController.google); //구글 로그인 API

// 페이지 관련
userRouter.get('/:user_id',jwtMiddleware,mainController.getAll); //메인 페이지 조회
userRouter.patch('/:user_id/sticker_message',jwtMiddleware,stickerController.postMessage); //스티커 메세지 등록(Host, Visitor) 
userRouter.get('/:user_id/visitor_sticker/:visitor_sticker_id',stickerController.getSticker); //방문자 기록 visitor_sticker_id로 상세 조회 API
userRouter.get("/:user_id/all_stickers",jwtMiddleware,stickerController.getStickers); //방문자 기록 페이지 조회

// 스티커 관련
// userRouter.post('/:user_id/sticker',stickerController.hostSticker); //Host 스티커 등록
// userRouter.post('/:user_id/stickers/new',jwtMiddleware,stickerController.visitorSticker); //Visitor 스티커 등록
userRouter.post('/:user_id/sticker',jwtMiddleware,stickerController.postSticker); //스티커 등록(Host,Visitor)
userRouter.patch('/:user_id/attach_sticker',jwtMiddleware,stickerController.attachSticker); //스티커 부착, 스티커 위치 수정도 같은 API 호출


// nQnA 관련
userRouter.post('/:user_id/default_q',nqnaController.postDefaultQuestion); //default 질문 등록 API
userRouter.post('/:user_id/visitor_q',nqnaController.postVisitorQuestion); //visitor 질문 등록 API
userRouter.patch('/:user_id/nQnA/:nQnA_id/answer',nqnaController.postAnswer); //Host 답변 등록 API
userRouter.get('/:user_id/nQnA',jwtMiddleware,nqnaController.getnQnA); //N문 N답 조회 API



export default userRouter;


