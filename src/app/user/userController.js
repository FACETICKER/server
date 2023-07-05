import axios from "axios";
import {kakaoLogin} from "./userService.js";
import dotenv from "dotenv";
dotenv.config();

export const handleKakaoCallback = async(req,res)=>{ 
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
        const userInfo = userInfoResponse.data;
        const provider = 'kakao';
        const Result = await kakaoLogin(userInfo,provider); //새로운 사용자 생성 
        return res.status(200).send(Result);
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Failed to process Kakao callback' });
    }
};
