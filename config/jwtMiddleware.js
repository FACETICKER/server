import jwt from "jsonwebtoken";
import baseResponse from "./baseResponse.js";
import { errResponse } from "./response.js";
import dotenv from "dotenv";
dotenv.config();

export const jwtMiddleware = (req,res,next)=>{
    const token = req.headers['x-access-token'] || req.query.token; //토큰을 헤드/url에서 읽어옴
    if(!token){
        return res.send(errResponse(baseResponse.TOKEN_EMPTY));
    }

    const p = new Promise((resoleve,reject)=>{ //Promise 객체를 생성하여 JWT 토큰을 검증
        jwt.verify(token,process.env.JWT_SECRET,(err,verifiedToken)=>{
            if(err) reject(err); //에러가 존재하면 reject를 호출해서 Promise를 실패 상태로 전환
            resoleve(verifiedToken); //성공하면 resolve로 검증된 토큰을 반환
        })
    });

    const onError = (error) => { //에러가 발생했으면 에러 메세지 반환
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE))
    };
    
    p.then((verifiedToken)=>{
        req.verifiedToken = verifiedToken;
        next();
    }).catch(onError);





}