import { response } from "express";
import pool from "../../../config/database.js";
import {loginDao, userDao, stickerDao, nqnaDao, posterDao} from "./userDao.js";
import baseResponse from "../../../config/baseResponse.js";

export const userCheck = async(userInfoParams) =>{ // 사용자 정보를 조회
    try{
        const connection = await pool.getConnection(async conn => conn);
        const userCheckResult = await loginDao.findUser(connection,userInfoParams);
        connection.release();
        return userCheckResult;
    }catch(err){
        console.error(err);
    }
};

export const userProvider = {
    retrieveUser : async(user_id) =>{ //user_id로 유저 조회
        try{ 
            const connection = await pool.getConnection(async conn => conn);
            const userResult = await userDao.selectUser(connection,user_id);
            connection.release();
    
            return userResult;
        }catch(err){
           console.error(err);
        }
    },
    
    retrieveUserId : async(nickname) =>{ //닉네임으로 회원 번호 조회
        try{
            const connection = await pool.getConnection(async conn => conn);
            const getIdByNicknameResult = await userDao.getIdByNickname(connection, nickname);
            connection.release();
            return getIdByNicknameResult.user_id;
        }catch(err){
            console.error(err);
        }
    },
    
    retrieveUserName : async(user_id)=>{ //회원 번호로 닉네임 조회
        const connection = await pool.getConnection(async conn => conn);
        const getNicknameByIdResult = await userDao.getNicknameById(connection,user_id);
        connection.release();
        return getNicknameByIdResult;
    }
};

export const stickerProvider = { //스티커
    VisitorStickerById : async(visitor_sticker_id) =>{ //개별 스티커 조회
        try{
        const connection = await pool.getConnection(async conn => conn);
        const visitorStickerResult = await stickerDao.selectVisitorStickerById(connection,visitor_sticker_id);
    
        connection.release();
    
        return visitorStickerResult[0];
        }catch(err){
            console.error(err);
        }
    },
    StickerCollections : async(user_id) =>{ //회원 번호로 전체 스티커 조회
        try{
            const connection = await pool.getConnection(async conn => conn);
            const selectUserStickerResult = await stickerDao.selectUserSticker(connection, user_id);
            const selectVisitorStickersResult = await stickerDao.selectVisitorStickers(connection,user_id);
            connection.release();
            const stickersResult = {
                userStickerResult:selectUserStickerResult,
                visitorStickerResult:selectVisitorStickersResult
            };
            return stickersResult; 
        }catch(err){
            console.error(err);
        }
    },
    userSticker : async(user_id)=>{ //호스트 스티커 조회
        const connection = await pool.getConnection(async conn => conn);
        const userStickerResult = await stickerDao.selectUserSticker(connection,user_id);
        connection.release();
        return userStickerResult;
    },
    newStickers : async(user_id)=>{ //새로운 스티커 수 조회
        const connection = await pool.getConnection(async conn => conn);
        const newStickersResult = await stickerDao.selectNewSticker(connection,user_id);
        connection.release();
        return newStickersResult;
    },
    retrieveStickerInfo : async()=>{
        const connection = await pool.getConnection(async conn => conn);
        const faceResult = await stickerDao.selectFace(connection);
        const eyesResult = await stickerDao.selectEyes(connection);
        const noseResult = await stickerDao.selectNose(connection);
        const mouthResult = await stickerDao.selectMouth(connection);
        const armResult = await stickerDao.selectArm(connection);
        const footResult = await stickerDao.selectFoot(connection);
        const accessoryResult = await stickerDao.selectAccessory(connection);
        connection.release();
        const retrieveStickerInfoResult = {
            face : faceResult,
            eyes : eyesResult,
            nose : noseResult,
            mouth : mouthResult,
            arm : armResult,
            foot : footResult,
            accessory : accessoryResult
        };
        return retrieveStickerInfoResult;
    },
    retrieveStickerDeatils : async(userId) =>{
        const connection = await pool.getConnection(async conn => conn);
        const detailsResult = await stickerDao.selectUserStickerDetails(connection,userId);
        connection.release();
        return detailsResult;
    },
    retrieveHostMessage : async(userId) =>{
        const connection = await pool.getConnection(async conn => conn);
        const retrieveResult = await stickerDao.selectHostMessage(connection,userId);
        connection.release();
        return retrieveResult;
    }
};

export const nqnaProvider = { //n문n답
    retrieveNQnA : async(nQnA_id) =>{ //nQnA 개별 조회
        try{ 
            const connection = await pool.getConnection(async conn => conn);
            const nQnAResult = await nqnaDao.selectNQnA(connection,nQnA_id);
            //console.log(nQnAResult[0].answer); >> answer 내용 출력됨
            connection.release();

            return nQnAResult[0]; // {객체}로 넘어감 

        }catch(err){
            console.error(err);        
        }
        },

     retrieveHostnQnA : async(user_id) =>{ //호스트 플로우 nQnA 전체 조회
  
        const connection = await pool.getConnection(async conn => conn);
        const hostNQnAResult = await nqnaDao.selectHostNQnA(connection,user_id);
        connection.release();
    
        return hostNQnAResult;
    },
    
    retrieveVisitorNQnA : async(user_id) =>{ //방문자 플로우 nQnA 전체 조회
        try{ 
            const connection = await pool.getConnection(async conn => conn);
            const visitorNQnAResult = await nqnaDao.selectVisitorNQnA(connection,user_id);
            connection.release();
    
            return visitorNQnAResult;
    
        }catch(err){
            console.error(err);        
        }
        },

    retrieveEmptyAnswer : async(user_id) =>{ //미답변 질문 개수 조회
        try{ 
            const connection = await pool.getConnection(async conn => conn);
            const EmptyAnswerResult = await nqnaDao.selectEmptyAnswer(connection,user_id);
            connection.release();
    
            return EmptyAnswerResult;
    
        }catch(err){
            console.error(err);  
        }
        },
    
    retrieveVisitorQuestion : async(user_id,userIdFromJWT) =>{ //(방문자 플로우) 로그인한 방문자가 남긴 질문 조회
        try{ 
            const selectVisitorQuestionParms = [user_id,userIdFromJWT];

            const connection = await pool.getConnection(async conn => conn);
            const VisitorQuestionResult = await nqnaDao.selectVisitorQuestion(connection,selectVisitorQuestionParms);
            connection.release();
    
            return VisitorQuestionResult;
    
        }catch(err){
            console.error(err);  
        }
        },
};

export const posterProvider = { //포스터
    poster: async(user_id)=>{
        const connection = await pool.getConnection(async conn => conn);
        const posterResult = await posterDao.selectPoster(connection,user_id);
        connection.release();
        return posterResult;
    },
    retrieveImportant: async(user_id)=>{
        const connection = await pool.getConnection(async conn => conn);
        const retrieveResult = await posterDao.selectImportant(connection,user_id);
        connection.release();
        return retrieveResult;
    }
}
