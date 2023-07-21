import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { response,errResponse } from "../../../config/response";
import baseResponse from "../../../config/baseResponse";
import {kakaoLogin, googleLogin, getStickersByType, insertUserSticker} from "./userService.js";
import {retrieveVisitorStickerById} from "./userProvider";


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
        const userInfo = userInfoResponse.data.kakao_account;
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

/**
 * API Name: 방문자 기록 상세 조회
 * GET: /visitor/{visitor_sticker_id}
 */
export const getVisitorStickerById = async(req,res)=>{ //호스트가 방문자의 기록(페이스티커, 캐릭터 네임, 메세지)을 상세 조회
    
    /**
     * Path Parameters: visitor_sticker_id
     */
        const {params:{visitor_sticker_id}} = req;
        
        try {
            const visitorStickerById = await retrieveVisitorStickerById(visitor_sticker_id);
            if (visitorStickerById) {
                return res.status(200).json(response(baseResponse.SUCCESS, visitorStickerById));
            } else {
                return res.status(404).json(errResponse(baseResponse.STICKER_STICKERID_NOT_EXIST));
            }

        } catch (error) {
            return res.status(500).json(errResponse(baseResponse.SERVER_ERROR));
        }
        
};

export const getStickers = async (req,res)=>{ //해당 호스트의 전체 스티커를 반환
    try{
        const userIdFromJWT = req.verifiedToken ? req.verifiedToken.user_id : null; // 토큰이 있을 때만 user_id를 가져오도록 수정
        const nickname = req.params.nickname;
        const params = {
            userIdFromJWT: userIdFromJWT,
            nickname : nickname,
        };
        const stickersResult = await getStickersByType(params); //호스트와 방문자를 구분해주기 위해
        return res.send(stickersResult);

    }catch(err){
        return res.status(500).json(err);
    }
};


export const postSticker = async(req,res)=>{ //스티커 등록
    try{
        const params = [req.params.id, req.body.face, req.body.nose, req.body.eyes, req.body.mouth,
                        req.body.arm,req.body.foot,req.body.accessory,];
        const postStickerResult = await insertUserSticker(params);
        return res.send(postStickerResult);
    }catch(err){
        return res.status(500).send(err);
    }

}