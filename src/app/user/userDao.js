//import User from "../../../models/user.js";

export const findUser = async(userInfoParams)=>{
    const findUserResponse = await User.findOne({
        where:{
            user_email : `${userInfoParams.email}`,
            provider : `${userInfoParams.provider}`
        }
    })
    return findUserResponse;
};

export const createUser = async(userInfoParams) =>{
    const createUserResponse = await User.create({
        user_email : `${userInfoParams.email}`,
        provider : `${userInfoParams.provider}`,
    });
    return createUserResponse;
}

export const selectVisitorStickerId = async(connection, visitor_sticker_id)=>{
    const selectVisitorStickerIdQuery = `
        SELECT final_image_id, name, message
        FROM visitor_sticker
        WHERE visitor_sticker_id = ?;
    `;
    const [userRow] = await connection.query(selectVisitorStickerIdQuery, visitor_sticker_id);
    return userRow;
}