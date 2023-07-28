import express from "express";

import { loginController, stickerController, nqnaController, mainController,posterController  } from "./userController";
import { jwtMiddleware } from "../../../config/jwtMiddleware.js";

const userRouter = express.Router();

//웹 브라우저에서 favicon.ico를 자동으로 요청해서 /favicon.ico 요청이 
//메인 페이지 조회 API /:nickname으로 가기 때문에 이를 무시하기 위해서 아래처럼 라우팅 처리를 해줌
userRouter.get('/favicon.ico',(req,res)=>res.status(404).end()); 

// 로그인 관련
userRouter.get('/auth/kakao/callback',loginController.kakao); //카카오 로그인 API
userRouter.get('/auth/google/callback',loginController.google); //구글 로그인 API

// 페이지 관련
userRouter.get('/:user_id',jwtMiddleware,mainController.getAll); //메인 페이지 조회
userRouter.patch('/:user_id/sticker/message',jwtMiddleware,stickerController.postMessage); //스티커 메세지 등록(Host, Visitor) 
userRouter.get('/:user_id/sticker/visitor/:visitor_sticker_id',stickerController.getSticker); //방문자 기록 visitor_sticker_id로 상세 조회 API
userRouter.get("/:user_id/sticker/all",jwtMiddleware,stickerController.getStickers); //방문자 기록 페이지 조회

// 스티커 관련
// userRouter.post('/:user_id/sticker',stickerController.hostSticker); //Host 스티커 등록
// userRouter.post('/:user_id/stickers/new',jwtMiddleware,stickerController.visitorSticker); //Visitor 스티커 등록
userRouter.post('/:user_id/sticker',jwtMiddleware,stickerController.postSticker); //스티커 등록(Host,Visitor)
userRouter.patch('/:user_id/sticker/attach',jwtMiddleware,stickerController.attachSticker); //스티커 부착, 스티커 위치 수정도 같은 API 호출


// nQnA 관련
userRouter.post('/:user_id/nqna/default',nqnaController.postDefaultQuestion); //default 질문 등록 API
userRouter.post('/:user_id/nqna/visitor',nqnaController.postVisitorQuestion); //visitor 질문 등록 API
userRouter.patch('/:user_id/nqna/:nQnA_id/answer',nqnaController.postAnswer); //Host 답변 등록 + 수정 API
userRouter.get('/:user_id/nqna',jwtMiddleware,nqnaController.getnQnA); //N문 N답 조회 API
userRouter.patch('/:user_id/nqna/:nQnA_id/question/hidden',nqnaController.patchQuestionHidden); //질문 공개 여부 수정 API
userRouter.patch('/:user_id/nqna/:nQnA_id/answer/hidden',nqnaController.patchAnswerHidden); //답변 공개 여부 수정 API



//포스터 관련
userRouter.post("/:user_id/poster",jwtMiddleware,posterController.postPoster); //포스터 등록

export default userRouter;


