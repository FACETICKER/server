import pool from "../../../config/database.js";
import {findUser,selectVisitorStickerById, selectUserSticker, selectVisitorStickers,getIdByNickname,selectDefaultQuestions } from "./userDao.js";

export const userCheck = async(userInfoParams) =>{ // 사용자 정보를 조회
    try{
        const connection = await pool.getConnection(async conn => conn);
        const userCheckResult = await findUser(connection,userInfoParams);
        connection.release();
        return userCheckResult;
    }catch(err){
        console.error(err);
    }
};


export const retrieveVisitorStickerById = async(visitor_sticker_id) =>{
    const connection = await pool.getConnection(async conn => conn);
    const visitorStickerResult = await selectVisitorStickerById(connection,visitor_sticker_id);

    connection.release();

    return visitorStickerResult[0];
};

export const retrieveDefaultQuestions = async(default_q_id) =>{ //default 질문 조회 (전체 조회 + 개별 조회)
    const connection = await pool.getConnection(async conn => conn);

    if(default_q_id == null){ //default_q_id가 null이라면 질문 전체 조회
        const DefaultQuestionsResult = await selectDefaultQuestions(connection);
        connection.release();

        return DefaultQuestionsResult;
    }
    else{ //default_q_id로 default 질문 개별 조회
        const DefaultQuestionsResult = await selectDefaultQuestions(connection,default_q_id);
        connection.release();

        return DefaultQuestionsResult;
    }
};

export const retrieveStickerCollections = async(user_id) =>{ //회원 번호로 전체 스티커 조회
    try{
        const connection = await pool.getConnection(async conn => conn);
        const selectUserStickerResult = await selectUserSticker(connection, user_id);
        const selectVisitorStickersResult = await selectVisitorStickers(connection,user_id);
        connection.release();
        const stickersResult = {
            userStickerResult:selectUserStickerResult,
            visitorStickerResult:selectVisitorStickersResult
        };
        return stickersResult; 
    }catch(err){
        console.error(err);
    }
};

export const retrieveUserId = async(nickname) =>{ //닉네임으로 회원 번호 조회
    try{
        const connection = await pool.getConnection(async conn => conn);
        const getIdByNicknameResult = await getIdByNickname(connection, nickname);
        connection.release();
        return getIdByNicknameResult.user_id;
    }catch(err){
        console.error(err);
    }
}
