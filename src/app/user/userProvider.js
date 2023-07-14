import pool from "../../../config/database.js";
import {findUser} from "./userDao.js";


export const userCheck = async(userInfoParams) =>{ // 사용자 정보를 조회해서 사용자가 있으면 1 없으면 0을 반환
    try{
        const connection = await pool.getConnection(async conn => conn);
        const userCheckResult = await findUser(connection,userInfoParams);
        connection.release();
        return userCheckResult;

    }catch(err){
        console.log("--------------------------------");
        console.error(err);
    }
}