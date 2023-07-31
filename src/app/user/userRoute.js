import express from "express";

import { loginController, stickerController, nqnaController, mainController,posterController  } from "./userController.js";
import { jwtMiddleware } from "../../../config/jwtMiddleware.js";

const userRouter = express.Router();

//웹 브라우저에서 favicon.ico를 자동으로 요청해서 /favicon.ico 요청이 
//메인 페이지 조회 API /:nickname으로 가기 때문에 이를 무시하기 위해서 아래처럼 라우팅 처리를 해줌
userRouter.get('/favicon.ico',(req,res)=>res.status(404).end()); 

// 로그인 관련
userRouter.get('/auth/kakao/callback',loginController.kakao); //카카오 로그인 API
/**
 * @swagger
 * paths:
 *  /auth/kakao/callback:
 *   get:
 *    summary : 로그인하여 토큰 발급
 *    tags : [로그인]
 *    description: 카카오 로그인
 *    responses:
 *      '200':
 *        description: 로그인 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 *              result:
 *                  type: object
 *                  properties:
 *                      user_id:
 *                          type: integer
 *                      jwt:
 *                          type: string
 */
userRouter.get('/auth/google/callback',loginController.google); //구글 로그인 API
/**
 * @swagger
 * paths:
 *  /auth/google/callback:
 *   get:
 *    summary : 로그인하여 토큰 발급
 *    tags: [로그인]
 *    description: 구글 로그인
 *    responses:
 *      '200':
 *        description: 로그인 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 *              result:
 *                  type: object
 *                  properties:
 *                      user_id:
 *                          type: integer
 *                      jwt:
 *                          type: string
 */


// 페이지 관련
userRouter.get('/:user_id',jwtMiddleware,mainController.getAll); //메인 페이지 조회
/**
 * @swagger
 * paths:
 *  /:user_id:
 *   get:
 *    summary : 호스트/방문자 메인 페이지 조회
 *    tags: [메인 페이지]
 *    description: 메인 페이지 조회
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    responses:
 *      '200':
 *        description: 메인 페이지 조회 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 *              result:
 *                  type: object
 *                  properties:
 *                      userNickname:
 *                          type: string
 *                      hostPoster:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  user_poster_id:
 *                                      type: integer
 *                                  user_id:
 *                                      type: integer
 *                                  nickname:
 *                                      type: string
 *                                  q_season:
 *                                      type: string
 *                                  q_number:
 *                                      type: integer
 *                                  q_date:
 *                                      type: string
 *                                      format: date-time
 *                                  q_important:
 *                                      type: string
 *                      hostSticker:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  user_id:
 *                                      type: integer
 *                                  image_url:
 *                                      type: string
 *                      hostnewSticer:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  count:
 *                                      type: integer
 */
userRouter.patch('/:user_id/sticker/message',jwtMiddleware,stickerController.postMessage); //스티커 메세지 등록(Host, Visitor)
/**
 * @swagger
 * paths:
 *  /:user_id/sticker/message:
 *   patch:
 *    summary : 호스트/방문자 메세지 등록
 *    tags: [메인 페이지]
 *    description: 스티커 메세지 등록
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: string
 *    - in: query
 *      name: type
 *      required: true
 *      description: host 또는 visitor
 *      schema:
 *        type: string
 *    - in: body
 *      name: message
 *      required: true
 *      description: 방문자들에게 남길 메시지
 *      schema:
 *        type: string
 *    responses:
 *      '200':
 *        description: 스티커 메세지 등록 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 */
userRouter.get('/:user_id/sticker/visitor/:visitor_sticker_id',stickerController.getSticker); //방문자 기록 visitor_sticker_id로 상세 조회 API

userRouter.get("/:user_id/sticker/all",jwtMiddleware,stickerController.getStickers); //방문자 기록 페이지 조회
/**
 * @swagger
 * paths:
 *  /:user_id/sticker/all:
 *   get:
 *    summary : 방문자가 남긴 스티커 전체 조회
 *    tags: [메인 페이지]
 *    description: 방문자 스티커 기록 페이지 조회
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    responses:
 *      '200':
 *        description: 조회 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 *              result:
 *                  type: object
 *                  properties:
 *                      userStickerResult:
 *                          type: object
 *                          properties:
 *                              user_id:
 *                                  type: integer
 *                              image_url:
 *                                  type: string
 *                      visitorStickerResult:
 *                          type: object
 *                          properties:
 *                              visitor_sticker_id:
 *                                  type: integer
 *                              image_url:
 *                                  type: string
 *                              seen:
 *                                  type: boolean
 *                              location_x:
 *                                  type: integer
 *                              location_y:
 *                                  type: integer
 */



// 스티커 관련
userRouter.post('/:user_id/sticker',jwtMiddleware,stickerController.postSticker); //스티커 등록(Host,Visitor)
/**
 * @swagger
 * paths:
 *  /:user_id/sticker:
 *   post:
 *    summary : 호스트/방문자 스티커 등록
 *    tags: [스티커]
 *    description: 스티커 등록
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    - in: query
 *      name: type
 *      required: true
 *      description: host 또는 visitor
 *      schema:
 *        type: string
 *    responses:
 *      '200':
 *        description: 조회 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 */
userRouter.patch('/:user_id/sticker/attach',jwtMiddleware,stickerController.attachSticker); //스티커 부착, 스티커 위치 수정도 같은 API 호출
/**
 * @swagger
 * paths:
 *  /:user_id/sticker/attach:
 *   patch:
 *    summary : 방문자 스티커 부탁
 *    tags: [스티커]
 *    description: 스티커 부착 + 위치 수정
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    - in: body
 *      name: x
 *      required: true
 *      description: x 좌표
 *      schema:
 *        type: integer
 *    - in: body
 *      name: y
 *      required: true
 *      description: y 좌표
 *      schema:
 *        type: integer
 *    responses:
 *      '200':
 *        description: 조회 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 */
userRouter.get('/sticker/info',stickerController.getInfo); //스티커 요소들 호출 API(얼굴,눈,코,입....)
/**
 * @swagger
 * paths:
 *  /sticker/info:
 *   get:
 *    summary : 스티커 생성에 필요한 이미지 조회
 *    tags: [스티커]
 *    description: 스티커 요소들 조회(얼굴, 눈,코,입,손,발,악세사리)
 *    responses:
 *      '200':
 *        description: 조회 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 *              result:
 *                  type: object
 *                  properties:
 *                      face:
 *                          type: object
 *                          properties:
 *                              face_id:
 *                                  type: integer
 *                              face_url:
 *                                  type: string
 *                      eyes:
 *                          type: object
 *                          properties:
 *                              eyes_id:
 *                                  type: integer
 *                              face_url:
 *                                  type: string
 *                      nose:
 *                          type: object
 *                          properties:
 *                              nose_id:
 *                                  type: integer
 *                              face_url:
 *                                  type: string
 *                      mouth:
 *                          type: object
 *                          properties:
 *                              mouth_id:
 *                                  type: integer
 *                              mouth_url:
 *                                  type: string
 *                      arm:
 *                          type: object
 *                          properties:
 *                              arm_id:
 *                                  type: integer
 *                              arm_url:
 *                                  type: string                 
 *                      foot:
 *                          type: object
 *                          properties:
 *                              foot_id:
 *                                  type: integer
 *                              foot_url:
 *                                  type: string
 *                      accessory:
 *                          type: object
 *                          properties:
 *                              accessory_id:
 *                                  type: integer
 *                              accessory_url:
 *                                  type: string                      
 */
userRouter.get('/:user_id/sticker/detail',jwtMiddleware,stickerController.getStickerDetails);
/**
 * @swagger
 * paths:
 *  /:user_id/sticker/detail:
 *   get:
 *    summary : 호스트 스티커 상세 정보
 *    tags: [스티커]
 *    description: 호스트가 선택한 스티커 상세 정보
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    responses:
 *      '200':
 *        description: 조회 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 *              result:
 *                  type: object
 *                  properties:
 *                      face_id:
 *                          type: integer
 *                      eyes_id:
 *                          type: integer
 *                      nose_id:
 *                          type: integer
 *                      mouth_id:
 *                          type: integer
 *                      arm:
 *                          type: integer      
 *                      foot:
 *                          type: integer
 *                      accessory:
 *                          type: integer                  
 */


// nQnA 관련
userRouter.post('/:user_id/nqna/default',nqnaController.postDefaultQuestion); //default 질문 등록 API
userRouter.post('/:user_id/nqna/visitor',nqnaController.postVisitorQuestion); //visitor 질문 등록 API
userRouter.patch('/:user_id/nqna/:nQnA_id/answer',nqnaController.postAnswer); //Host 답변 등록 + 수정 API
userRouter.get('/:user_id/nqna',jwtMiddleware,nqnaController.getnQnA); //N문 N답 조회 API
userRouter.patch('/:user_id/nqna/:nQnA_id/question/hidden',nqnaController.patchQuestionHidden); //질문 공개 여부 수정 API
userRouter.patch('/:user_id/nqna/:nQnA_id/answer/hidden',nqnaController.patchAnswerHidden); //답변 공개 여부 수정 API

//포스터 관련
userRouter.post("/:user_id/poster",jwtMiddleware,posterController.postPoster); //포스터 등록
/**
 * @swagger
 * paths:
 *  /:user_id/poster:
 *   post:
 *    summary : 포스터 정보 등록
 *    tags: [포스터]
 *    description: 호스트의 포스터 정보 등록
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    - in: body
 *      name: nickname
 *      required: true
 *      description: 사용자 닉네임
 *      schema:
 *        type: string
 *    - in: body
 *      name: season
 *      required: true
 *      description: 좋아하는 계절
 *      schema:
 *        type: string
 *    - in: body
 *      name: number
 *      required: true
 *      description: 좋아하는 숫자
 *      schema:
 *        type: integer
 *    - in: body
 *      name: date
 *      required: true
 *      description: 의미있는 날
 *      schema:
 *        type: string
 *    - in: body
 *      name: important
 *      required: true
 *      description: 사랑 vs 우정
 *      schema:
 *        type: string
 *    responses:
 *      '200':
 *        description: 등록 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string               
 */

export default userRouter;


