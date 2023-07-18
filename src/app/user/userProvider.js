import pool from "../../../config/database.js";
import {findUser} from "./userDao.js";


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
}