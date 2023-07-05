import axios from "axios";
import {kakaoLogin, googleLogin} from "./userService.js";
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

export const handleGoogleCallback = async(req,res)=>{
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
        const result = await googleLogin(userInfo, provider);
        return res.status(200).send(result);
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Failed to process Kakao callback' });
    }
};