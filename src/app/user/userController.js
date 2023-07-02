import axios from "axios";
import qs from "qs"
import {createUser} from "./userService.js";
import dotenv from "dotenv";
dotenv.config();

export const handleKakaoCallback = async(req,res)=>{ 
    const code = req.query.code;
    try{
        const accessTokenResponse = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers:{
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_ID,
                redirect_uri: 'http://localhost:8001/auth/kakao/callback',
                code: code,
            })
        });
        const accessToken = accessTokenResponse.data.access_token;
        const userInfoResponse = await axios({
            method: 'GET',
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                'Authorization':`Bearer ${accessToken}`,
                'content-type': 'application/x-www-form-urlencoded'
            }
        })
        const userInfo = userInfoResponse.data; 
        const provider = 'kakao';
        const Result = await createUser(userInfo,provider);
        console.log(Result);
        return res.status(200).send(Result);
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Failed to process Kakao callback' });
    }
};