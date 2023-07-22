import {response, errResponse} from "../../../config/response.js";
import baseResponse from "../../../config/baseResponse.js";
import { userCheck, retrieveUserId, retrieveStickerCollections } from "./userProvider.js";
import {createUser,insertDefaultQuestion, insertAnswer } from "./userDao.js";
import pool from "../../../config/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const kakaoLogin = async(userInfo, provider) =>{
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
            const newUserResponse = await createUser(connection,userInfoParams); 
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
};

export const googleLogin = async(userInfo, provider) =>{
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
            const newUserResponse = await createUser(connection,userInfoParams); 
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
};

export const getStickersByType = async(params) =>{
    try{
        const userId = await retrieveUserId(params.nickname);
        const stickerCollections = await retrieveStickerCollections(userId);
        if(params.userIdFromJWT === userId){
            return response(baseResponse.HOST,stickerCollections);
        }else{
            return response(baseResponse.VISITOR,stickerCollections);
        }
    }catch(err){
        console.error(err);
    }
};

export const createDefaultQuestion = async(user_id,onlyDefaultQuestion) =>{
    try{
        const insertDefaultQuestionParams =[user_id,onlyDefaultQuestion]; 
    
        const connection = await pool.getConnection(async conn => conn);
        const createDefaultQuestionResult = await insertDefaultQuestion(connection,insertDefaultQuestionParams);
        
        connection.release();
        
        return response(baseResponse.SUCCESS);
    }
    catch(error){
        return errResponse(baseResponse.DB_ERROR)
    }
};

export const createAnswer = async(answer, user_id,nQnA_id) =>{
    try{
        const insertAnswerParams =[answer, user_id,nQnA_id]; 
    
        const connection = await pool.getConnection(async conn => conn);
        const createAnswerResult = await insertAnswer(connection,insertAnswerParams);
        
        connection.release();
        
        return response(baseResponse.SUCCESS);
    }
    catch(error){
        return errResponse(baseResponse.DB_ERROR)
    }
};
