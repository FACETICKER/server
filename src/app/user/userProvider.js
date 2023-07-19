import pool from "../../../config/database.js";
import {findUser,selectVisitorStickerId, selectUserSticker, selectVisitorStickers,getIdByNickname } from "./userDao.js";

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

export const retrieveVisitorSticker = async(visitor_sticker_id) =>{
    const connection = await pool.getConnection(async conn => conn);
    const visitorStickerResult = await selectVisitorStickerId(connection,visitor_sticker_id);

    connection.release();

    return visitorStickerResult[0];
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
