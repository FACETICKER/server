import express from "express";

import {
  loginController,
  stickerController,
  nqnaController,
  mainController,
  posterController,
} from "./userController.js";
import { jwtMiddleware } from "../../../config/jwtMiddleware.js";

const userRouter = express.Router();

//웹 브라우저에서 favicon.ico를 자동으로 요청해서 /favicon.ico 요청이
//메인 페이지 조회 API /:nickname으로 가기 때문에 이를 무시하기 위해서 아래처럼 라우팅 처리를 해줌
userRouter.get("/favicon.ico", (req, res) => res.status(404).end());

// 로그인 관련
userRouter.post("/login/kakao", loginController.kakao); //카카오 로그인 API
/**
 * @swagger
 * paths:
 *  /login/kakao:
 *   post:
 *    summary : 로그인하여 토큰 발급
 *    tags : [로그인]
 *    description: 카카오 로그인
 *    parameters:
 *    - in : query
 *      name: code
 *      required: true
 *      description: 인가 코드
 *      schema:
 *        type: integer
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
userRouter.post("/login/google", loginController.google); //구글 로그인 API
/**
 * @swagger
 * paths:
 *  /auth/google/callback:
 *   post:
 *    summary : 로그인하여 토큰 발급
 *    tags: [로그인]
 *    description: 구글 로그인
 *    parameters:
 *    - in : query
 *      name: code
 *      required: true
 *      description: 인가 코드
 *      schema:
 *        type: integer
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
userRouter.get("/:user_id", jwtMiddleware, mainController.getAll); //메인 페이지 조회
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
userRouter.patch(
  "/:user_id/sticker/message",
  jwtMiddleware,
  stickerController.postMessage
); //스티커 메세지 등록(Host, Visitor)
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
userRouter.get(
  "/:user_id/sticker/visitor/:visitor_sticker_id",
  stickerController.getSticker
); //방문자 기록 visitor_sticker_id로 상세 조회 API
/**
 * @swagger
 * paths:
 *  /:user_id/sticker/visitor/:visitor_sticker_id:
 *   get:
 *    summary : 방문자가 남긴 스티커 상세 조회
 *    tags: [메인 페이지]
 *    description: 방문자 기록 페이지에서 스티커 클릭 시 나타나는 스티커 정보 상세 조회
 *    parameters:
 *    - in: path
 *      name: visitor_sticker_id
 *      required: true
 *      description: 방문자 스티커 ID
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
 *                      visitorStickerResult:
 *                          type: object
 *                          properties:
 *                              image_url:
 *                                  type: integer
 *                              name:
 *                                  type: string
 *                              message:
 *                                  type: string
 *                              visitor_id:
 *                                  type: integer
 */

userRouter.get(
  "/:user_id/sticker/all",
  jwtMiddleware,
  stickerController.getStickers
); //방문자 기록 페이지 조회
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
userRouter.patch(
  "/:user_id/sticker/all/location",
  jwtMiddleware,
  stickerController.patchStickerLocation
); //스티커 위치 수정
/**
 * @swagger
 * paths:
 *  /:user_id/sticker/all/location:
 *   patch:
 *    summary : 방문자 스티커 위치 수정
 *    tags: [스티커]
 *    description: 스티커 수정
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    - in: body
 *      name: id
 *      required: true
 *      description: 방문자 스티커 아이디
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
 *        description: 변경 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 */

// 스티커 관련
userRouter.post(
  "/:user_id/sticker",
  jwtMiddleware,
  stickerController.postSticker
); //스티커 등록(Host,Visitor)
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
 *    - in: body
 *      name: face
 *      required: true
 *      description: 페이스 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: eyes
 *      required: true
 *      description: 눈 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: nose
 *      required: true
 *      description: 코 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: mouth
 *      required: true
 *      description: 입 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: arm
 *      required: true
 *      description: 팔 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: foot
 *      required: true
 *      description: 발 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: accessory
 *      required: true
 *      description: 악세사리 스티커 번호
 *      schema:
 *        type: integer
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
userRouter.patch(
  "/:user_id/sticker/attach",
  jwtMiddleware,
  stickerController.attachSticker
); //스티커 부착
/**
 * @swagger
 * paths:
 *  /:user_id/sticker/attach:
 *   patch:
 *    summary : 방문자 스티커 부착
 *    tags: [스티커]
 *    description: 스티커 부착
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
 *        description: 수정 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 */

userRouter.get(
  "/:user_id/sticker/detail",
  jwtMiddleware,
  stickerController.getStickerDetails
);
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
 *                      arm_id:
 *                          type: integer
 *                      foot_id:
 *                          type: integer
 *                      accessory_id:
 *                          type: integer
 */

userRouter.patch(
  "/:user_id/sticker/patch",
  jwtMiddleware,
  stickerController.patchSticker
); //호스트 스티커 수정
/**
 * @swagger
 * paths:
 *  /:user_id/sticker/patch:
 *   patch:
 *    summary : 호스트 스티커 수정
 *    tags: [스티커]
 *    description: 스티커 수정
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    - in: body
 *      name: face
 *      required: false
 *      description: 페이스 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: eyes
 *      required: false
 *      description: 눈 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: nose
 *      required: false
 *      description: 코 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: mouth
 *      required: false
 *      description: 입 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: arm
 *      required: false
 *      description: 팔 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: foot
 *      required: false
 *      description: 발 스티커 번호
 *      schema:
 *        type: integer
 *    - in: body
 *      name: accessory
 *      required: false
 *      description: 악세사리 스티커 번호
 *      schema:
 *        type: integer
 *    responses:
 *      '200':
 *        description: 수정 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 */

// nQnA 관련
userRouter.post(
  "/:user_id/nqna/question/default",
  nqnaController.postDefaultQuestion
); //default 질문 등록 API
/**
 * @swagger
 * paths:
 *  /:user_id/nqna/question/default:
 *   post:
 *    summary : default 질문 등록
 *    tags: [N문 N답]
 *    description: default 질문 등록
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    - in: body
 *      name: question
 *      required: true
 *      description: default 질문 내용
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
userRouter.post(
  "/:user_id/nqna/question/visitor",
  jwtMiddleware,
  nqnaController.postVisitorQuestion
); //visitor 질문 등록 API
/**
 * @swagger
 * paths:
 *  /:user_id/nqna/question/visitor:
 *   post:
 *    summary : visitor 질문 등록
 *    tags: [N문 N답]
 *    description: visitor 질문 등록
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    - in: body
 *      name: question
 *      required: true
 *      description: visitor 질문 내용
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
userRouter.patch("/:user_id/nqna/:nQnA_id/answer", nqnaController.postAnswer); //Host 답변 등록 + 수정 API
/**
 * @swagger
 * paths:
 *  /:user_id/nqna/:nQnA_id/answer:
 *   patch:
 *    summary : Host 답변 등록 + 수정
 *    tags: [N문 N답]
 *    description: Host 답변 등록 + 수정
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    - in: body
 *      name: answer
 *      required: true
 *      description: 답변 내용
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
userRouter.get("/:user_id/nqna", jwtMiddleware, nqnaController.getnQnA); //N문 N답 조회 API
/**
 * @swagger
 * paths:
 *  /:user_id/nqna:
 *   get:
 *    summary : N문 N답 조회
 *    tags: [N문 N답]
 *    description: N문 N답 전체 조회 (호스트 AND 방문자 플로우)
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    responses:
 *      '200':
 *        description: 호스트 플로우 조회 성공
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
 *                      hostNQnAResult:
 *                          type: object
 *                          properties:
 *                              question:
 *                                  type: string
 *                              question_type:
 *                                  type: integer
 *                              question_hidden:
 *                                  type: integer
 *                              answer:
 *                                  type: string
 *                              answer_hidden:
 *                                  type: integer
 *                              created_at:
 *                                  type: string
 *                                  format: date-time
 *      '201':
 *        description: 방문자 플로우 조회 성공
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
 *                      visitorNQnAResult:
 *                          type: object
 *                          properties:
 *                              question:
 *                                  type: string
 *                              question_hidden:
 *                                  type: integer
 *                              answer:
 *                                  type: string
 *                              answer_hidden:
 *                                  type: integer
 *                              created_at:
 *                                  type: string
 *                                  format: date-time
 */
userRouter.patch(
  "/:user_id/nqna/:nQnA_id/question/hidden",
  nqnaController.patchQuestionHidden
); //질문 공개 여부 수정 API
/**
 * @swagger
 * paths:
 *  /:user_id/nqna/:nQnA_id/question/hidden:
 *   patch:
 *    summary : 질문 공개 여부 수정
 *    tags: [N문 N답]
 *    description: 질문 공개 여부 수정
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    - in: body
 *      name: question_hidden
 *      required: true
 *      description: 질문 공개 여부
 *      schema:
 *        type: integer
 *    responses:
 *      '200':
 *        description: 수정 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 */
userRouter.patch(
  "/:user_id/nqna/:nQnA_id/answer/hidden",
  nqnaController.patchAnswerHidden
); //답변 공개 여부 수정 API
/**
 * @swagger
 * paths:
 *  /:user_id/nqna/:nQnA_id/answer/hidden:
 *   patch:
 *    summary : 답변 공개 여부 수정
 *    tags: [N문 N답]
 *    description: 답변 공개 여부 수정
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    - in: body
 *      name: answer_hidden
 *      required: true
 *      description: 답변 공개 여부
 *      schema:
 *        type: integer
 *    responses:
 *      '200':
 *        description: 수정 성공
 *        schema:
 *          properties:
 *              isSuccess:
 *                  type: boolean
 *              code:
 *                  type: integer
 *              message:
 *                  type: string
 */
userRouter.get(
  "/:user_id/nqna/question/emptyanswer",
  nqnaController.getEmptyAnswer
); //미답변 질문 개수 조회 API
/**
 * @swagger
 * paths:
 *  /:user_id/nqna/question/emptyanswer:
 *   get:
 *    summary : 미답변 질문 개수 조회
 *    tags: [N문 N답]
 *    description: 미답변 질문 개수 조회
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
 *                      EmptyAnswerResult:
 *                          type: object
 *                          properties:
 *                              emptyanswer:
 *                                  type: integer
 */
userRouter.get(
  "/:user_id/nqna/question/visitor",
  jwtMiddleware,
  nqnaController.getVisitorQuestion
); //(방문자 플로우) 로그인한 방문자가 남긴 질문 조회 API
/**
 * @swagger
 * paths:
 *  /:user_id/nqna/question/visitor:
 *   get:
 *    summary : (방문자 플로우) 로그인한 방문자가 남긴 질문 조회
 *    tags: [N문 N답]
 *    description: (방문자 플로우) 로그인한 방문자가 남긴 질문 조회
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
 *                      VisitorQuestionResult:
 *                          type: object
 *                          properties:
 *                              nQnA_id:
 *                                  type: integer
 *                              question:
 *                                  type: string
 *                              visitor_id:
 *                                  type: integer
 */

//포스터 관련
userRouter.post("/:user_id/poster", jwtMiddleware, posterController.postPoster); //포스터 등록
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
userRouter.patch(
  "/:user_id/poster/patch",
  jwtMiddleware,
  posterController.patchPoster
); //포스터 수정
/**
 * @swagger
 * paths:
 *  /:user_id/poster/patch:
 *   patch:
 *    summary : 포스터 정보 수정
 *    tags: [포스터]
 *    description: 호스트의 포스터 정보 수정
 *    parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      description: 사용자 ID
 *      schema:
 *        type: integer
 *    - in: body
 *      name: season
 *      required: false
 *      description: 좋아하는 계절
 *      schema:
 *        type: string
 *    - in: body
 *      name: number
 *      required: false
 *      description: 좋아하는 숫자
 *      schema:
 *        type: integer
 *    - in: body
 *      name: date
 *      required: false
 *      description: 의미있는 날
 *      schema:
 *        type: string
 *    - in: body
 *      name: important
 *      required: false
 *      description: 사랑 vs 우정
 *      schema:
 *        type: string
 *    responses:
 *      '200':
 *        description: 수정 성공
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
