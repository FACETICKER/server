import {response, errResponse} from "../../../config/response.js";
import baseResponse from "../../../config/baseResponse.js";
import { findUser, createUser } from "./userDao.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const kakaoLogin = async(userInfo, provider) =>{
    try{
        //기존의 사용자인지 확인
        const userInfoParams = {
            email : `${userInfo.kakao_account.email}`,
            provider: `${provider}`,
        };
        const exUser = await findUser(userInfoParams);
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
            const newUser = await createUser(userInfoParams);
            //토큰 발급
            if(newUser){
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
