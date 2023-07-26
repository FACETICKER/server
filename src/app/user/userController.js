import axios from "axios";
import dotenv from "dotenv";
import { response,errResponse } from "../../../config/response";
import baseResponse from "../../../config/baseResponse";
import {loginService, stickerService, nqnaService, mainpageService} from "./userService.js";
import {stickerProvider, nqnaProvider, retrieveUserId, posterProvider} from "./userProvider";
dotenv.config();
export const loginController = {
    kakao : async(req,res)=>{ //카카오
        const code = req.query.code;
        try{
            const accessTokenResponse = await axios({ //카카오 API 호출해서 Access Token 받아오기
                method: 'POST',
                url: 'https://kauth.kakao.com/oauth/token',
                headers:{
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: ({
                    grant_type: 'authorization_code',
                    client_id: process.env.KAKAO_ID,
                    redirect_uri: 'http://localhost:8001/auth/kakao/callback',
                    code: code,
                })
            });
            const accessToken = accessTokenResponse.data.access_token;
            const userInfoResponse = await axios({ //카카오 API 호출해서 사용자 정보 불러오기
                method: 'GET',
                url:'https://kapi.kakao.com/v2/user/me',
                headers:{
                    'Authorization':`Bearer ${accessToken}`,
                    'content-type': 'application/x-www-form-urlencoded'
                }
            })
            const userInfo = userInfoResponse.data.kakao_account;
            const provider = 'kakao';
            const Result = await loginService.kakao(userInfo,provider); //새로운 사용자 생성 
            return res.status(200).send(Result);
        }catch(err){
            console.error(err);
            return res.status(500).json({ error: 'Failed to process Kakao callback' });
        }
    },
    google: async(req,res)=>{ //구글
        const code = req.query.code; //구글 인가 코드
        try{
            const accessTokenResponse = await axios({ //구글 access token 받아오기
                method: 'POST',
                url: 'https://oauth2.googleapis.com/token',
                headers:{
                    'content-Type': 'x-www-form-urlencoded'
                },
                data: {
                    code: code,
                    client_id: process.env.GOOGLE_ID,
                    client_secret: process.env.GOOGLE_SECRET,
                    redirect_uri: 'http://localhost:8001/auth/google/callback',
                    grant_type : 'authorization_code'
                },
            });
            const accessToken = accessTokenResponse.data.access_token;
            const userInfoResponse = await axios({ // 구글 access token으로 사용자 정보 불러오기
                method: 'GET',
                url: 'https://www.googleapis.com/userinfo/v2/me',
                headers:{
                    'Authorization':`Bearer ${accessToken}`,
                    'content-type': 'x-www-form-urlencoded'
                },
            });
            const provider = 'google';
            const userInfo = userInfoResponse.data;
            const result = await loginService.google(userInfo, provider);
            return res.status(200).send(result);
        }catch(err){
            console.error(err);
            return res.status(500).json({ error: 'Failed to process Kakao callback' });
        }
    },
};

export const stickerController = {

    /**
     * API Name: 방문자 기록 상세 조회
     * GET: /visitor/{visitor_sticker_id}
     */
    getSticker : async(req,res)=>{ //호스트가 방문자의 기록(페이스티커, 캐릭터 네임, 메세지)을 상세 조회
    
        const {params:{visitor_sticker_id}} = req;
        try {
            const visitorStickerById = await stickerProvider.VisitorStickerById(visitor_sticker_id);
            if (visitorStickerById) {
                return res.status(200).json(response(baseResponse.SUCCESS,visitorStickerById));
            } else {
                return res.status(404).json(errResponse(baseResponse.STICKER_STICKERID_NOT_EXIST));
            }

        } catch (error) {
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
        
    },
    getStickers : async (req,res)=>{ //해당 호스트의 전체 스티커를 반환
        try{
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null; // 토큰이 있을 때만 user_id를 가져오도록 수정
            const nickname = req.params.nickname;
            const params = {
                userIdFromJWT: userIdFromJWT,
                nickname : nickname,
            };
            const stickersResult = await stickerService.getStickersByType(params); //호스트와 방문자를 구분해주기 위해
            return res.send(stickersResult);
    
        }catch(err){
            return res.status(500).json(err);
        }
    },
    postSticker : async (req,res)=>{  //스티커 등록
        try{ 
            const type = req.query.type; //type으로 Host, visitor 구분
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null;
            const {face, nose, eyes, mouth, arm, foot, accessory} = req.body;
            const nickname = req.params.nickname;
            if(type === 'host'){ //호스트 스티커 등록
                const params = [userIdFromJWT, face, nose, eyes, mouth, arm, foot, accessory];
                const insertResult = await stickerService.insertUserSticker(params);
                return res.send(insertResult);
            }else if(type === 'visitor'){ //방문자 스티커 등록
                const hostId = await retrieveUserId(nickname);
                const params = [hostId, userIdFromJWT, face, nose, eyes, mouth, arm, foot, accessory];
                const insertResult = await stickerService.insertVisitorSticker(params);
                return res.send(insertResult);
            }
        }catch(err){
            return res.status(500).send(err);
        }
    },
    postMessage : async(req,res)=>{ 
        try{
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null;
            const message = req.body.message;
            const type = req.query.type;
            if(type === 'host'){
                const result = await stickerService.insertUserMessage(userIdFromJWT,message);
                return res.send(result);
            }else if(type ==='visitor'){
                const sticker_id = req.query.id;
                const result = await stickerService.insertVisitorMessage(sticker_id,message);
                return res.send(result);
            }
        }catch(err){
            return res.status(500).send(err);
        }
    }
};

export const nqnaController = {

    /**
     * API Name: default 질문 조회 (전체 조회 + 개별 조회)
    * GET: /default_q
    */
    getDefaultQuestions : async(req,res)=>{
        
        const {default_q_id} = req.body; // 일단 body 요청으로 deafult_q_id를 받아옴. null일 수도 있음.

        try {
            const defaultQuestions = await nqnaProvider.DefaultQuestions(default_q_id);
            return res.status(200).json(response(baseResponse.SUCCESS, defaultQuestions));
        } catch (error) {
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
    },

    /**
    * API Name: default 질문 등록
    * POST: /host/{user_id}/default_q
    */
    postDefaultQuestion : async(req,res) => {
        const {default_q_id} = req.body;
        const {user_id} = req.params;
        const defaultQuestion = await nqnaProvider.DefaultQuestions(default_q_id); // default_q_id로 default 질문 개별 조회
        const onlyDefaultQuestion = defaultQuestion[0].question // defaultQuestion 객체의 question값만 가져오기
        try{
            const postDefaultQuestionResult = await nqnaService.createDefaultQuestion(user_id,onlyDefaultQuestion);
            return res.status(200).json(response(baseResponse.SUCCESS, postDefaultQuestionResult));
        }catch(error){
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
        },

    /**
     * API Name: Host 답변 등록
     * patch: /host/{user_id}/answer/{nQnA_id}
     */
    postAnswer : async(req,res) => {
   
        const {answer} = req.body;
        const {user_id, nQnA_id} = req.params;
        /*
        const User = await retrieveUser(user_id); // 이 부분은 각각 user_id, nQnA_id로 회원 조회, 질문 조회하는 API가 추가되어야 가능한 예외 처리
            if(User){
                const nQnA = await retrieveNQnA(nQnA_id);
                if(nQnA){
                    const postAnswerResult = await nqnaService.createAnswer(answer, user_id,nQnA_id);
                    return res.status(200).json(response(baseResponse.SUCCESS, postAnswerResult));
                }
                else{
                    return res.status(404).json(errResponse(baseResponse. NQNA_NQNAID_NOT_EXIST));
                }
            }
            else{
            return res.status(404).json(errResponse(baseResponse. USER_USERID_NOT_EXIST));
            }
        */

        try{
            const postAnswerResult = await nqnaService.createAnswer(answer,user_id,nQnA_id);

            return res.status(200).json(response(baseResponse.SUCCESS, postAnswerResult));
        }
        catch(error){
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
    }
};

export const mainController = {
    getAll : async(req,res) =>{
        const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null; // 토큰이 있을 때만 user_id를 가져오도록 수정
        const nickname = req.params.nickname;
        const result = await mainpageService(userIdFromJWT,nickname);
        return res.send(result);
    }
}