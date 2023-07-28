import {response, errResponse} from "../../../config/response.js";
import baseResponse from "../../../config/baseResponse.js";
import { userCheck, stickerProvider, posterProvider, userProvider } from "./userProvider.js";
import {loginDao,nqnaDao, stickerDao, posterDao } from "./userDao.js";
import pool from "../../../config/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const loginService = { //로그인 서비스
    kakao: async(userInfo, provider) =>{
        try{
            //기존의 사용자인지 확인
            const userInfoParams = [`${userInfo.email}`, `${provider}`];
            const exUser = await userCheck(userInfoParams); //기존의 사용자인지 확인
            if(exUser){
                //토큰 발급
                let token = jwt.sign({
                    user_id : exUser.user_id,
                    user_email : userInfo.email,
                },
                process.env.JWT_SECRET,{
                    expiresIn: "1h",
                });
                return response(baseResponse.SIGNUP_KAKAO_EXUSER,{'user_id':exUser.user_id,'jwt':token});
            }
            else{ //기존의 사용자가 아니면 새로운 사용자 추가
                const connection = await pool.getConnection(async conn => conn); //pool 연결 설정
                const newUserResponse = await loginDao.createUser(connection,userInfoParams); 
                connection.release();
                //토큰 발급
                if(newUserResponse.affectedRows === 1){ //성공적으로 DB에 추가됐으면 토큰 발급
                    let token = jwt.sign({
                        user_id : newUserResponse.insertId,
                        user_email: userInfo.email,
                    },process.env.JWT_SECRET,{
                        expiresIn: "1h",
                    });
                    return response(baseResponse.SIGNUP_KAKAO_NEWUSER,{'user_id':newUserResponse.insertId,'jwt':token});//회원 번호하고 토큰 반환
                };
            }
        }catch(err){
            console.error(err);
            return errResponse(baseResponse.DB_ERROR);
        }
    },
    google: async(userInfo, provider) =>{
        try{
            const userInfoParams = [`${userInfo.email}`, `${provider}`];
            const exUser = await userCheck(userInfoParams); //기존의 사용자인지 확인
            if(exUser){ //기존의 사용자면 토큰 발급
                let token = jwt.sign({
                    user_id : exUser.user_id,
                    user_email: userInfo.email,
                },process.env.JWT_SECRET,{
                    expiresIn: "1h",
                });
                return response(baseResponse.SIGNUP_GOOGLE_EXUSER,{'user_id':exUser.user_id,'jwt':token}); //회원 번호하고 토큰 반환
            }
            else{ //기존의 사용자가 아니므로 DB에 새로운 사용자 추가
                const connection = await pool.getConnection(async conn => conn); //pool 연결 설정
                const newUserResponse = await loginDao.createUser(connection,userInfoParams); 
                connection.release();
                if(newUserResponse.affectedRows === 1){ //성공적으로 DB에 추가됐으면 토큰 발급
                    let token = jwt.sign({
                        user_id : newUserResponse.insertId,
                        user_email: userInfo.email,
                    },process.env.JWT_SECRET,{
                        expiresIn: "1h",
                    });
                    return response(baseResponse.SIGNUP_GOOGLE_NEWUSER,{'user_id':newUserResponse.insertId,'jwt':token});//회원 번호하고 토큰 반환
                };
            };
        }catch(err){
            console.error(err);
            return errResponse(baseResponse.DB_ERROR);
        }
    },
};

export const stickerService = { //스티커 관련 서비스
    getStickersByType : async(params) =>{ //스티커 조회 + 호스트/방문자 구별 
    try{
        const stickerCollections = await stickerProvider.StickerCollections(params.user_id); //해당 페이지의 모든 스티커를 조회
        if(params.userIdFromJWT === params.user_id){ //만약 토큰이 있을 경우 회원 번호가 같으면 호스트 아니면 방문자
            return response(baseResponse.HOST,stickerCollections);
        }else{
            return response(baseResponse.VISITOR,stickerCollections);
        }
    }catch(err){
        console.error(err);
        }
    },
    insertUserSticker : async(params) =>{ //호스트 스티커 등록
        try{
            const connection = await pool.getConnection(async conn=> conn);
            const insertUserStickerResult = await stickerDao.createUserSticker(connection,params);
            connection.release();
            if(insertUserStickerResult.affectedRows === 1){
                return response(baseResponse.SUCCESS);
            }else{
                return response(baseResponse.DB_ERROR);
            }
        }catch(err){
            console.error(err);
        }
    },
    insertVisitorSticker : async(params) =>{ //방문자 스티커 등록
        try{
            const connection = await pool.getConnection(async conn => conn);
            const createVisitorStickerResult = await stickerDao.createVisitorSticker(connection,params);
            connection.release();
            if(createVisitorStickerResult.affectedRows === 1){
                return response(baseResponse.SUCCESS,{'visitor_id':createVisitorStickerResult.insertId});
            }else return response(baseResponse.DB_ERROR);
        }catch(err){
            console.error(err);
        }
    },
    insertUserMessage : async(userId, message) =>{ //사용자 메세지 등록
        try{
            const connection = await pool.getConnection(async conn => conn);
            const insertUserMessageResult = await stickerDao.insertUserMessage(connection,userId,message);
            if(insertUserMessageResult.changedRows === 1 && insertUserMessageResult.affectedRows === 1){
                return response(baseResponse.SUCCESS);
            }else return response(baseResponse.DB_ERROR);
        }catch(err){
            console.error(err);
        }
    },
    insertVisitorMessage : async(visitorId, name, message) =>{ //방문자 메세지 등록
        try{
            const connection = await pool.getConnection(async conn => conn);
            const params = [name,message, visitorId];
            const insertVisitorMessageResult = await stickerDao.insertVisitorMessage(connection,params);
            connection.release();
            if(insertVisitorMessageResult.changedRows === 1 && insertVisitorMessageResult.affectedRows===1){
                return response(baseResponse.SUCCESS);
            }else return response(baseResponse.DB_ERROR);
        }catch(err){
            console.error(err);
        }
    },
    insertStickerLocation : async(params) =>{ //방문자 스티커 부착 위치 등록
        try{
            const connection = await pool.getConnection(async conn => conn);
            const insertStickerLocationResult = await stickerDao.insertStickerLocation(connection,params);
            connection.release();
            console.log(insertStickerLocationResult);
            if(insertStickerLocationResult.changedRows === 1 && insertStickerLocationResult.affectedRows===1){
                return response(baseResponse.SUCCESS);
            }else return response(baseResponse.DB_ERROR);
        }catch(err){
            console.error(err);
        }
    }
};

export const nqnaService = { //n문n답 관련 서비스
    createDefaultQuestion : async(user_id,question) =>{ // default 질문 생성
        try{
            
            const insertDefaultQuestionParams =[user_id,question]; 
        
            const connection = await pool.getConnection(async conn => conn);
            const createDefaultQuestionResult = await nqnaDao.insertDefaultQuestion(connection,insertDefaultQuestionParams);
            
            connection.release();
            
            return response(baseResponse.SUCCESS);
        }
        catch(error){
            return errResponse(baseResponse.DB_ERROR)
        }
    },

    createVisitorQuestion : async(user_id,question) =>{ // visitor 질문 생성
        try{
            const insertVisitorQuestionParams =[user_id,question]; 
        
            const connection = await pool.getConnection(async conn => conn);
            const createVisitorQuestionResult = await nqnaDao.insertVisitorQuestion(connection,insertVisitorQuestionParams);

            connection.release();
            
            return response(baseResponse.SUCCESS);
        }
        catch(error){
            return errResponse(baseResponse.DB_ERROR)
        }
    },

    createAnswer : async(answer,nQnA_id) =>{ // 답변 등록 + 수정

        try{
            const insertAnswerParams =[answer,nQnA_id]; 
        
            const connection = await pool.getConnection(async conn => conn);
            const createAnswerResult = await nqnaDao.insertAnswer(connection,insertAnswerParams);
            
            connection.release();
            
            return response(baseResponse.SUCCESS);
        }
        catch(error){
            return errResponse(baseResponse.DB_ERROR)
        }
    },

    editnQnAHidden : async(nQnA_id, question_hidden, answer_hidden) =>{ // nQnA 공개 여부 수정 (질문 + 답변)

        try{    
            const updatenQnAHiddenParams = {nQnA_id, question_hidden, answer_hidden};

            const connection = await pool.getConnection(async conn => conn);
            const editnQnAHiddenResult = await nqnaDao.updatenQnAHidden(connection,updatenQnAHiddenParams);
            
            connection.release();
            
            return response(baseResponse.SUCCESS);
        }
        catch(error){
            return errResponse(baseResponse.DB_ERROR)
        }
    },
};

export const mainpageService = async(userIdFromJWT,user_id) =>{
    const poster = await posterProvider.poster(user_id);
    const sticker = await stickerProvider.userSticker(user_id);
    const newSticker = await stickerProvider.newStickers(user_id);
    console.log(userIdFromJWT);
    console.log(user_id);
    if(userIdFromJWT == user_id){ //사용자가 본인 페이지에 들어갔을 경우
        const result = {
            poster:poster,
            sticker:sticker,
            newSticker:newSticker,
        };
        return response(baseResponse.HOST,result); 
    }else{ //방문자가 다른 사용자 페이지에 방문했을 경우
        const result = {
            userId: userIdFromJWT, //본인 프로필으로 돌아갈 경우를 위해
            hostPoster: poster,
            hostSticker:sticker,
            hostnewSticer : newSticker
        };
        return response(baseResponse.VISITOR,result);
    }
};

export const posterService = {
    insertPoster : async(params) =>{
        const connection = await pool.getConnection(async conn => conn);
        const insertPosterResult = await posterDao.insertPoster(connection,params);
        connection.release();
        if(insertPosterResult.affectedRows===1){
            return response(baseResponse.SUCCESS);
        }else return response(baseResponse.DB_ERROR);
    }
};

