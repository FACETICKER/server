import pool from "../../../config/database"
import { selectVisitorStickerId } from "./userDao";


export const retrieveVisitorSticker = async(visitor_sticker_id) =>{
    const connection = await pool.getConnection(async conn => conn);
    const visitorStickerResult = await selectVisitorStickerId(connection,visitor_sticker_id);

    connection.release();

    return visitorStickerResult[0];
}