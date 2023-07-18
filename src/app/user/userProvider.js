import pool from "../../../config/database.js";
import {findUser,selectVisitorStickerId, selectUserSticker, selectVisitorStickers} from "./userDao.js";

export const userCheck = async(userInfoParams) =>{ // 사용자 정보를 조회
    try{
        const connection = await pool.getConnection(async conn => conn);
        const userCheckResult = await findUser(connection,userInfoParams);
        connection.release();
        return userCheckResult;
    }catch(err){
        console.log("--------------------------------");
        console.error(err);
    }
};

export const retrieveVisitorSticker = async(visitor_sticker_id) =>{
    const connection = await pool.getConnection(async conn => conn);
    const visitorStickerResult = await selectVisitorStickerId(connection,visitor_sticker_id);

    connection.release();

    return visitorStickerResult[0];
};

export const retrieveStickerCollections = async(user_id) =>{
    try{
        const connection = await pool.getConnection(async conn => conn);
        const selectUserStickerResult = await selectUserSticker(connection, user_id);
        const selectVisitorStickersResult = await selectVisitorStickers(connection,user_id);
        connection.release();
        const stickersResult = {
            ...selectUserStickerResult,
            visitorStickerResult:selectVisitorStickersResult
        };
        return stickersResult; 
    }catch(err){
        console.error(err);
        return err;
    }
};
