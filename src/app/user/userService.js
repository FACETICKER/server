import {response, errResponse} from "../../../config/response.js";
import baseResponse from "../../../config/baseResponse.js";
import {createUser } from "./userDao.js";
import { userCheck } from "./userProvider.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../../../config/database.js";
dotenv.config();

export const kakaoLogin = async(userInfo, provider) =>{
    try{
        //기존의 사용자인지 확인
        const userInfoParams = [`${userInfo.kakao_account.email}`,`${provider}`,];
        const exUser = await userCheck(userInfoParams);
        if(exUser){
            //토큰 발급
            let token = jwt.sign({
                user_email : userInfo.kakao_account.email,
            },
            process.env.JWT_SECRET,{
                expiresIn: "1h",
            });
            return response(baseResponse.SIGNUP_KAKAO_EXUSER,{'jwt':token});
        }
        else{ //기존의 사용자가 아니면 새로운 사용자 추가
            const connection = await pool.getConnection(async conn => conn);
            const newUserResponse = await createUser(connection,userInfoParams);
            connection.release();
            const createUserResult = newUserResponse.affectedRows;
            //토큰 발급
            if(createUserResult){
                let token = jwt.sign({
                    user_email : userInfo.kakao_account.email,
                },
                process.env.JWT_SECRET,{
                    expiresIn: "1h",
                });
                return response(baseResponse.SIGNUP_KAKAO_NEWUSER,{'jwt':token});
            };
        }
    }catch(err){
        console.error(err);
        return errResponse(baseResponse.DB_ERROR);
    }
};

export const googleLogin = async(userInfo, provider) =>{
    try{
        const userInfoParams = {
            email : `${userInfo.email}`,
            provider: `${provider}`,
        };
        const exUser = await findUser(userInfoParams);
        if(exUser){
            let token = jwt.sign({
                user_email: userInfo.email,
            },process.env.JWT_SECRET,{
                expiresIn: "1h",
            });
            return response(baseResponse.SIGNUP_GOOGLE_EXUSER,{'jwt':token});
        }
        else{
            const newUser = await createUser(userInfoParams);
            if(newUser){
                let token = jwt.sign({
                    user_email: userInfo.email,
                },process.env.JWT_SECRET,{
                    expiresIn: "1h",
                });
                return response(baseResponse.SIGNUP_GOOGLE_NEWUSER,{'jwt':token});
            };
        };
    }catch(err){
        console.error(err);
        return errResponse(baseResponse.DB_ERROR);
    }
};