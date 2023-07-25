import {response, errResponse} from "../../../config/response.js";
import baseResponse from "../../../config/baseResponse.js";
import { userCheck, retrieveUserId,stickerProvider, posterProvider, retrieveUserName } from "./userProvider.js";
import {loginDao,nqnaDao, stickerDao } from "./userDao.js";
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
        const userId = await retrieveUserId(params.nickname); //해당 페이지의 호스트 회원 번호를 조회
        const stickerCollections = await stickerProvider.StickerCollections(userId); //해당 페이지의 모든 스티커를 조회
        if(params.userIdFromJWT === userId){ //만약 토큰이 있을 경우 회원 번호가 같으면 호스트 아니면 방문자
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
            const createUserStickerResult = await stickerDao.createUserSticker(connection,params);
            connection.release();
            console.log(createUserStickerResult);
            if(createUserStickerResult.affectedRows === 1){
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
                return response(baseResponse.SUCCESS);
            }else return response(baseResponse.DB_ERROR);
        }catch(err){
            console.error(err);
        }
    }
};

export const nqnaService = { //n문n답 관련 서비스
    createDefaultQuestion : async(user_id,onlyDefaultQuestion) =>{
        try{
            const insertDefaultQuestionParams =[user_id,onlyDefaultQuestion]; 
        
            const connection = await pool.getConnection(async conn => conn);
            const createDefaultQuestionResult = await nqnaDao.insertDefaultQuestion(connection,insertDefaultQuestionParams);
            
            connection.release();
            
            return response(baseResponse.SUCCESS);
        }
        catch(error){
            return errResponse(baseResponse.DB_ERROR)
        }
    },
};


export const mainpageService = async(userIdFromJWT,nickname) =>{
    const hostId = await retrieveUserId(nickname);
    const poster = await posterProvider.poster(hostId);
        const sticker = await stickerProvider.userSticker(hostId);
        const newSticker = await stickerProvider.newStickers(hostId);
    if(userIdFromJWT === hostId){ //사용자가 본인 페이지에 들어갔을 경우
        const result = {
            poster:poster,
            sticker:sticker,
            newSticker:newSticker,
        };
        return response(baseResponse.HOST,result); 
    }else{ //방문자가 다른 사용자 페이지에 방문했을 경우
        const userNickname = userIdFromJWT ? await retrieveUserName(userIdFromJWT) : null; //토큰이 존재하면 토큰 값으로 nickname 값 조회. 없으면 null
        const result = {
            userNickname: userNickname, //본인 프로필으로 돌아갈 경우를 위해
            hostPoster: poster,
            hostSticker:sticker,
            hostnewSticer : newSticker
        };
        return response(baseResponse.VISITOR,result);
    }
}

