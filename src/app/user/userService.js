import {response, errResponse} from "../../../config/response.js";
import baseResponse from "../../../config/baseResponse.js";
import { userCheck, retrieveUserId, retrieveStickerCollections } from "./userProvider.js";
import {createUser, createUserSticker } from "./userDao.js";
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
        const userId = await retrieveUserId(params.nickname); //해당 페이지의 호스트 회원 번호를 조회
        const stickerCollections = await retrieveStickerCollections(userId); //해당 페이지의 모든 스티커를 조회
        if(params.userIdFromJWT === userId){ //만약 토큰이 있을 경우 회원 번호가 같으면 호스트 아니면 방문자
            return response(baseResponse.HOST,stickerCollections);
        }else{
            return response(baseResponse.VISITOR,stickerCollections);
        }
    }catch(err){
        console.error(err);
    }
};

export const insertUserSticker = async(params) =>{ //호스트 스티커 등록
    try{
        const connection = await pool.getConnection(async conn=> conn);
        const createUserStickerResult = await createUserSticker(connection,params);
        connection.release();
        console.log(createUserStickerResult);
        if(createUserStickerResult.affectedRows === 1){
            return response(baseResponse.SUCCESS);
        }else{
            return response(baseResponse.DB_ERROR);
        }
    }catch(err){
        console.error(err);
    }
}

//final_image 생성 -> 
// const compositeImage = async(params) =>{
//     try{
//         const images = await Promise.all(Object.values(params).map(url => sharp(url).toBuffer()));
//         const combinedImage = await sharp({
//             create: {
//                 width: 800, // 합성된 이미지의 가로 크기
//                 height: 600, // 합성된 이미지의 세로 크기
//                 channels: 4, // RGBA 채널 사용
//                 background: { r: 255, g: 255, b: 255, alpha: 0 }, // 배경 색상 (투명)
//             }
//         })
//         .composite([
//             { input: images.faceShape, top: 0, left: 0 }, // 얼굴형 이미지
//             { input: images.eyes, top: 200, left: 100 }, // 눈 이미지
//             { input: images.nose, top: 300, left: 200 }, // 코 이미지
//             { input: images.mouth, top: 400, left: 200 }, // 입 이미지
//             { input: images.ears, top: 100, left: 500 }, // 귀 이미지
//         ])
//         .toBuffer();
//         return combinedImage;
//     }catch(err){
//         console.error(err);
//     }
// };
