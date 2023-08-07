import axios from "axios";
import dotenv from "dotenv";
import { response,errResponse } from "../../../config/response.js";
import baseResponse from "../../../config/baseResponse.js";
import {loginService, stickerService, nqnaService, mainpageService, posterService, chineseDict, dateFormat} from "./userService.js";
import {stickerProvider, nqnaProvider, userProvider} from "./userProvider.js";
dotenv.config();
export const loginController = {
    kakao : async(req,res)=>{ //카카오
        console.log('----------');
        const code = req.query.code;
        console.log(code);
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
                    redirect_uri: 'http://localhost:3001/oauth',
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
            console.log("API END");
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
                    redirect_uri: 'https://faceticker.site/app/auth/google/callback',
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
     * GET: /:user_id/sticker/visitor/:visitor_sticker_id
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
            const user_id = req.params.user_id;
            const params = {
                userIdFromJWT: userIdFromJWT,
                user_id : user_id,
            };
            const stickersResult = await stickerService.getStickersByType(params); //호스트와 방문자를 구분해주기 위해
            return res.status(200).send(stickersResult);
    
        }catch(err){
            return res.status(500).json(err);
        }
    },
    postSticker : async (req,res)=>{  //스티커 등록
        try{ 
            const type = req.query.type; //type으로 Host, visitor 구분
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null;
            const {face, nose, eyes, mouth, arm, foot, accessory} = req.body;
            const user_id = req.params.user_id;
            if(type === 'host'){ //호스트 스티커 등록
                const params = [userIdFromJWT, face, nose, eyes, mouth, arm, foot, accessory];
                const insertResult = await stickerService.insertUserSticker(params);
                return res.send(insertResult);
            }else if(type === 'visitor'){ //방문자 스티커 등록
                const params = [user_id, userIdFromJWT, face, nose, eyes, mouth, arm, foot, accessory];
                const insertResult = await stickerService.insertVisitorSticker(params);
                return res.send(insertResult);
            }
        }catch(err){
            return res.status(500).send(err);
        }
    },
    postMessage : async(req,res)=>{ //메세지 등록(Host, Visitor)
        try{
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null;
            const message = req.body.message;
            const type = req.query.type;
            if(type === 'host'){
                const result = await stickerService.insertUserMessage(userIdFromJWT,message);
                return res.send(result);
            }else if(type ==='visitor'){
                const sticker_id = req.query.id;
                const sticker_name = req.body.name;
                const result = await stickerService.insertVisitorMessage(sticker_id,sticker_name,message);
                return res.send(result);
            }
        }catch(err){
            return res.status(500).send(err);
        }
    },
    attachSticker : async(req,res)=>{ //스티커 위치 저장
        try{
            const {x,y} = req.body;
            const id = req.query.user_id; // 이 부분은 라우팅 경로가 nickname >> user_id로 바뀌어도 달라질 코드가 없는 게 맞나요?!?!?!
            const params = [x,y,id]; 
            const result = await stickerService.insertStickerLocation(params);
            return res.send(result);
        }catch(err){
            return res.send(err);
        }
    },
    getInfo : async(req,res) =>{
        try{
            const result = await stickerProvider.retrieveStickerInfo();
            return res.send(response(baseResponse.SUCCESS,result));
        }catch(err){
            return res.status(500).send(err);
        }
    },
    getStickerDetails : async(req,res)=>{
        try{
            const userid = req.params.user_id;
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null;
            if(userIdFromJWT==userid){
                const result = await stickerProvider.retrieveStickerDeatils(userid);
                return res.status(200).send(response(baseResponse.SUCCESS,result));
            }
        }catch(err){
            return res.status(500).send(errResponse(baseResponse.SERVER_ERROR));
        }
    },
    patchStickerLocation : async(req,res)=>{
        try{
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null;
            const userId = req.params.user_id;
            const reqBody = req.body;
            if(userId === userIdFromJWT){
                for(const[num, newPosition] of Object.entries(reqBody)){
                    console.log(newPosition);
                    const result = await stickerService.patchStickerLocation(newPosition);
                    if(result == fail){
                        return res.send(response(baseResponse.DB_ERROR));
                    }
                }
                return res.send(response(baseResponse.SUCCESS));
            }
        }catch(err){
            return res.json(err).send(err);
        }
    }
};

export const nqnaController = {
    /**
    * API Name: default 질문 등록
    * POST: /:user_id/nqna/question/default
    */
    postDefaultQuestion : async(req,res) => {

        
        try {
            const {question} = req.body;
            const {user_id} = req.params;
            const User = await userProvider.retrieveUser(user_id);

            if (User) {     
                const postDefaultQuestionResult = await nqnaService.createDefaultQuestion(user_id,question);
                return res.status(200).json(response(baseResponse.SUCCESS, postDefaultQuestionResult));
            }
            else {
                return res.status(404).json(response(baseResponse.USER_USERID_NOT_EXIST));
            }
        }
        catch(error){
            console.log(error);
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
    },

    /**
    * API Name: Visitor 질문 등록 
    * POST: /:user_id/nqna/question/visitor
    */
    postVisitorQuestion : async(req,res) => {
        try {
            const {question} = req.body;
            console.log(question); 
            const {user_id} = req.params; 
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null; // 로그인한 방문자의 ID

            const User = await userProvider.retrieveUser(user_id);
            if (User) {
                if(question.length === 0){
                    return res.status(400).json(errResponse(baseResponse.NQNA_QUESTION_EMPTY));
                }
                else if(question.length > 100){
                    return res.status(400).json(errResponse(baseResponse.NQNA_QUESTION_LENGTH));
                }
                else{
                    const postVisitorQuestionResult = await nqnaService.createVisitorQuestion(user_id, question, userIdFromJWT);
                    return res.status(200).json(response(baseResponse.SUCCESS, postVisitorQuestionResult));
                }
            } 
            else {
                return res.status(404).json(errResponse(baseResponse.USER_USERID_NOT_EXIST));
            }
        }
        catch(error){
            console.log(error);
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
    },

    /**
     * API Name: Host 답변 등록 + 수정
     * PATCH: /:user_id/nqna/:nQnA_id/answer
     */
    postAnswer : async(req,res) => {
        
        try{
            
            const {answer} = req.body;
            const {nQnA_id} = req.params;
            const nQnA = await nqnaProvider.retrieveNQnA(nQnA_id); // nQnA 개별 질문 조회

            if(nQnA){
                if(answer.length === 0){
                    return res.status(400).json(errResponse(baseResponse.NQNA_ANSWER_EMPTY));
                }
                else if(answer.length > 100){
                    return res.status(400).json(errResponse(baseResponse.NQNA_ANSWER_LENGTH));
                }
                else{
                    const postAnswerResult = await nqnaService.createAnswer(answer, nQnA_id);
                    return res.status(200).json(response(baseResponse.SUCCESS, postAnswerResult));
                }
            }
            else{
                return res.status(404).json(errResponse(baseResponse.NQNA_QUESTION_NOT_EXIST));
            }     
        }
        catch(error){
            console.log(error);
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
    },

    /**
     * API Name: N문 N답 조회 (호스트 AND 방문자 플로우)
     * GET: /{user_id}/nqna  
     */
    getnQnA : async(req,res)=>{
        
        try {
            const {user_id} = req.params; 
            //const type = req.query.type; //type으로 Host, visitor 구분 >>>> 일단 보류
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null; // 토큰이 있을 때만 user_id를 가져오도록 수정

            if(user_id == userIdFromJWT){ //호스트 본인의 N문 N답 페이지일 때 (호스트 플로우)

                const nQnA = await nqnaProvider.retrieveHostNQnA(user_id);
                return res.status(200).json({
                    isSuccess: true,
                    code: 1000,
                    message: "호스트 플로우 N문 N답 조회 성공",
                    result: nQnA
                });
            }
            else{ //다른 호스트의 N문 N답 페이지일 때 (방문자 플로우) 

                const nQnA = await nqnaProvider.retrieveVisitorNQnA(user_id);
                return res.status(200).json({
                    isSuccess: true,
                    code: 1000,
                    message: "방문자 플로우 N문 N답 조회 성공",
                    result: nQnA
                });
            }         
        } catch (error) {
            console.log(error);
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
    },

    /**
     * API Name: 질문 공개 여부 수정
     * PATCH: /:user_id/nqna/:nQnA_id/question/hidden
     */
    patchQuestionHidden : async(req,res) => {
   
        try{
            const {nQnA_id} = req.params;
            const {question_hidden} = req.body;
            const nQnA = await nqnaProvider.retrieveNQnA(nQnA_id); // nQnA 개별 질문 조회

            if(nQnA){ 
                const patchQuestionHiddenResult = await nqnaService.editnQuestionHidden(nQnA_id, question_hidden);
                return res.status(200).json(response(baseResponse.SUCCESS, patchQuestionHiddenResult));            
            }   
            else{
                return res.status(404).json(errResponse(baseResponse.NQNA_QUESTION_NOT_EXIST));
            }     
        }
        catch(error){
            console.log(error);
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
    },

     /**
     * API Name: 답변 공개 여부 수정
     * PATCH: /:user_id/nqna/:nQnA_id/answer/hidden
     */
    patchAnswerHidden : async(req,res) => {
   
        try{
            const {nQnA_id} = req.params;
            const {answer_hidden} = req.body;
            const nQnA = await nqnaProvider.retrieveNQnA(nQnA_id); // nQnA 개별 질문 조회

            if(nQnA){ // 질문이 존재한다면
            
                if(nQnA.answer !== null){ // 답변이 존재한다면

                    const patchAnswerResult = await nqnaService.editnAnswerHidden(nQnA_id, answer_hidden);
                    return res.status(200).json(response(baseResponse.SUCCESS, patchAnswerResult));            
                }
                else{
                    return res.status(404).json(errResponse(baseResponse.NQNA_ANSWER_NOT_EXIST));
                }
            }   
            else{
                return res.status(404).json(errResponse(baseResponse.NQNA_QUESTION_NOT_EXIST));
            }     
        }
        catch(error){
            console.log(error);
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
    },

    /**
     * API Name: 미답변 질문 개수 조회
     * GET: /:user_id/nqna/question/emptyanswer
     */
    getEmptyAnswer : async(req,res) =>{
    
        try{
            const {user_id} = req.params;
            const User = await userProvider.retrieveUser(user_id);

            if(User){
                const getEmptyAnswerResult = await nqnaProvider.retrieveEmptyAnswer(user_id);
                return res.status(200).json(response(baseResponse.SUCCESS, getEmptyAnswerResult)); 
            }
            else {
                return res.status(404).json(errResponse(baseResponse.USER_USERID_NOT_EXIST));
           }
        }catch(error){
            console.log(error);
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
    },

    /**
     * API Name: (방문자 플로우) 로그인한 방문자가 남긴 질문 조회
     * GET: /:user_id/nqna/question/visitor
     */
    getVisitorQuestion : async(req,res) =>{

        try{
            const {user_id} = req.params;
            const User = await userProvider.retrieveUser(user_id);
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null; // 로그인한 방문자의 user_id
            
            if(User){
                if(userIdFromJWT){ // 로그인한 방문자라면
                    const getVisitorQuestionResult = await nqnaProvider.retrieveVisitorQuestion(user_id, userIdFromJWT);

                    if(getVisitorQuestionResult[0] === undefined){//질문을 남기지 않은 방문자라면
                        return res.status(400).json(errResponse(baseResponse.NQNA_VISITOR_QUESTION_NOT_EXIST)); 
                    }
                    else{
                        return res.status(200).json(response(baseResponse.SUCCESS, getVisitorQuestionResult)); 
                    }
                }
                else{
                    return res.status(400).json(errResponse(baseResponse.SIGNIN_NOT_SIGNIN)); 
                }
            }
            else {
                return res.status(404).json(errResponse(baseResponse.USER_USERID_NOT_EXIST));
           }
        }catch(error){
            console.log(error);
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
    },
};

export const mainController = {
    getAll : async(req,res) =>{
        try{
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null; // 토큰이 있을 때만 user_id를 가져오도록 수정
            const userId = req.params.user_id;
            const result = await mainpageService(userIdFromJWT,userId);
            return res.send(result);
        }catch(err){
            return res.status(500).send(err);
        }
    }
};

export const posterController = {
    postPoster : async(req,res)=>{
        try{
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null; // 토큰이 있을 때만 user_id를 가져오도록 수정
            const userId = req.params.user_id;
            if(userId == userIdFromJWT){
                const {nickname, season, number, date, important} = req.body;
                const formattedDate = dateFormat(date);
                const random = chineseDict(important);
                const params = [userIdFromJWT, nickname,season,number,formattedDate,important,random.chinese, random.pronunciation, random.meaning];
                const result = await posterService.insertPoster(params);
                return res.send(result);
            }else return res.send(response(baseResponse.USER_NOT_HOST));
        }catch(err){
            return res.send(err);
        }
    },
    patchPoster : async(req,res)=>{
        try{
            const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null; // 토큰이 있을 때만 user_id를 가져오도록 수정
            const userId = req.params.user_id;
            const {season, number, date, important} = req.body;
            let params;
            if(season){
                params = [season, userId];
                const result = await posterService.updateSeason(params);
                if(result == 'failure') return res.status(200).send(response(baseResponse.SERVER_ERROR));
            }
            if(number){
                params = [number, userId];
                const result = await posterService.updateNumber(params);
                if(result == 'failure') return res.status(200).send(response(baseResponse.SERVER_ERROR));
            }
            if(date){
                const formattedDate = dateFormat(date);
                params = [formattedDate, userId];
                const result = await posterService.updateDate(params);
                if(result == 'failure') return res.status(200).send(response(baseResponse.SERVER_ERROR));
            }
            if(important){
                const random = chineseDict(important);
                params = [important, random.chinese, random.pronunciation, random.meaning, userId];
                const result = await posterService.updateImportant(params);
                if(result == 'failure') return res.status(200).send(response(baseResponse.SERVER_ERROR));
            }
            return res.status(200).send(response(baseResponse.SUCCESS));
        }catch(err){
            return res.status(500).send(err);
        }
    }
}