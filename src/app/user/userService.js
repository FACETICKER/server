import User from "../../../models/user.js"
import {response, errResponse} from "../../../config/response.js";
import baseResponse from "../../../config/baseResponse.js";

export const createUser = async(userInfo, provider) =>{
    try{
        //기존의 사용자인지 확인
        const exUser = await User.findOne({
            where:{
                user_id:`${userInfo.kakao_account.email}`,
                provider: `${provider}`,
            }
        })
        if(exUser){
            return response(baseResponse.SIGNUP_KAKAO_EXUSER);
        }
        else{ //기존의 사용자가 아니면 새로운 사용자 추가
            const newUser = await User.create({
                user_id: `${userInfo.kakao_account.email}`,
                user_name: `${userInfo.kakao_account.name}`,
                user_image: `${userInfo.kakao_account.profie.profie_image_url}`,
                provider: `${provider}`,
                birthday: `${userInfo.kakao_account.birthday}`,
            })
            return response(baseResponse.SIGNUP_KAKAO_NEWUSER);
        }
    }catch(err){
        console.error(err);
    }
}