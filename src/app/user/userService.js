import User from "../../../models/user.js"
import {response, errResponse} from "../../../config/response.js";
import baseResponse from "../../../config/baseResponse.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createUser = async(userInfo, provider) =>{
    try{
        //기존의 사용자인지 확인
        const exUser = await User.findOne({
            where:{
                user_email:`${userInfo.kakao_account.email}`,
                provider: `${provider}`,
            }
        })
        if(exUser){
            let token = jwt.sign({
                user_email : userInfo.kakao_account.email,
            },
            process.env.JWT_SECRET,{
                expiresIn: "1h",
            });
            console.log('---------------------------------');
            console.log(token);
            return response(baseResponse.SIGNUP_KAKAO_EXUSER,{'jwt':token});
        }
        else{ //기존의 사용자가 아니면 새로운 사용자 추가
            const newUser = await User.create({
                user_email: `${userInfo.kakao_account.email}`,
                user_name: `${userInfo.kakao_account.name}`,
                user_image: `${userInfo.kakao_account.profile.profile_image_url}`,
                provider: `${provider}`,
                birthday: `${userInfo.kakao_account.birthday}`,
            })
            let token = await jwt.sign({
                user_email : userInfo.kakao_account.email,
            },
            process.env.JWT_SECRET,{
                expiresIn: "1h",

            });
            return response(baseResponse.SIGNUP_KAKAO_NEWUSER,{'jwt':token});
        }
    }catch(err){
        console.error(err);
        return errResponse(baseResponse.DB_ERROR);
    }
}