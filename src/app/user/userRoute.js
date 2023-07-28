import express from "express";
import { loginController, stickerController, nqnaController, mainController} from "./userController";
import { jwtMiddleware } from "../../../config/jwtMiddleware.js";

const userRouter = express.Router();

// 로그인 관련
userRouter.get('/auth/kakao/callback',loginController.kakao); //카카오 로그인 API
/**
 * @swagger
 * paths:
 *  /auth/kakao/callback:
 *   get:
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

// nQnA 관련
userRouter.post('/:user_id/nQnA/default',nqnaController.postDefaultQuestion); //default 질문 등록 API
userRouter.post('/:user_id/nQnA/visitor',nqnaController.postVisitorQuestion); //visitor 질문 등록 API
userRouter.patch('/:user_id/nQnA/:nQnA_id/answer',nqnaController.postAnswer); //Host 답변 등록 API
userRouter.get('/:user_id/nQnA',jwtMiddleware,nqnaController.getnQnA); //N문 N답 조회 API


export default userRouter;


