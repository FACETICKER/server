import pool from "../../../config/database.js";
import {loginDao,stickerDao,getIdByNickname,nqnaDao, posterDao, getNicknameById } from "./userDao.js";

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

export const retrieveUserId = async(nickname) =>{ //닉네임으로 회원 번호 조회
    try{
        const connection = await pool.getConnection(async conn => conn);
        const getIdByNicknameResult = await getIdByNickname(connection, nickname);
        connection.release();
        return getIdByNicknameResult.user_id;
    }catch(err){
        console.error(err);
    }
};

export const retrieveUserName = async(user_id)=>{ //회원 번호로 닉네임 조회
    const connection = await pool.getConnection(async conn => conn);
    const getNicknameByIdResult = await getNicknameById(connection,user_id);
    connection.release();
    return getNicknameByIdResult;
};

export const stickerProvider = { //스티커
    VisitorStickerById : async(visitor_sticker_id) =>{ //개별 스티커 조회
        const connection = await pool.getConnection(async conn => conn);
        const visitorStickerResult = await stickerDao.selectVisitorStickerById(connection,visitor_sticker_id);
    
        connection.release();
    
        return visitorStickerResult[0];
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
    }
};

export const nqnaProvider = { //n문n답
    retrieveNQnA : async(nQnA_id) =>{ //nQnA 개별 조회
        try{ 
            const connection = await pool.getConnection(async conn => conn);
            const nQnAResult = await nqnaDao.selectNQnA(connection,nQnA_id);
            connection.release();

            return nQnAResult[0];

        }catch(err){
            return res.status(500).send(err);
        }
        },

    retrieveHostNQnA : async(hostId) =>{ //호스트 플로우 nQnA 전체 조회
        try{ 
            const connection = await pool.getConnection(async conn => conn);
            const hostNQnAResult = await nqnaDao.selectHostNQnA(connection,hostId);
            connection.release();
    
            return hostNQnAResult;
    
        }catch(err){
            return res.status(500).send(err);
        }
        },
    
    retrieveVisitorNQnA : async(hostId) =>{ //방문자 플로우 nQnA 전체 조회
        try{ 
            const connection = await pool.getConnection(async conn => conn);
            const visitorNQnAResult = await nqnaDao.selectVisitorNQnA(connection,hostId);
            connection.release();
    
            return visitorNQnAResult;
    
        }catch(err){
            return res.status(500).send(err);
        }
        },
};

export const posterProvider = { //포스터
    poster: async(user_id)=>{
        const connection = await pool.getConnection(async conn => conn);
        const posterResult = await posterDao.selectPoster(connection,user_id);
        connection.release();
        return posterResult;
    }

}
