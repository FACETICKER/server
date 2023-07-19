export const findUser = async(connection, userInfoParams)=>{ //사용자 조회
    const findUserQuery = `
    SELECT user_id, user_email, provider, COUNT(*) as count
    FROM user
    WHERE user_email = ?
    AND provider = ?
    GROUP BY user_id, user_email, provider;
    `
    const [findUserRow] = await connection.query(findUserQuery,userInfoParams);
    return findUserRow[0];
};

export const createUser = async(connection,userInfoParams) =>{ //사용자 등록
    const createUserQuery = `
    INSERT INTO user(user_email, provider)
    VALUES(?,?);
    `
    const createUserRow = await connection.query(createUserQuery,userInfoParams);
    return createUserRow[0];
};
export const selectVisitorStickerId = async(connection, visitor_sticker_id)=>{
    const selectVisitorStickerIdQuery = `
        SELECT final_image_id, name, message
        FROM visitor_sticker
        WHERE visitor_sticker_id = ?;
    `;
    const [userRow] = await connection.query(selectVisitorStickerIdQuery, visitor_sticker_id);
    return userRow;
};

export const selectUserSticker = async(connection,user_id) =>{
    const selectUserStickerQuery = `
        SELECT user_id, image_url
        FROM final_image
        JOIN user_sticker ON final_image.final_image_id = user_sticker.final_image_id
        WHERE user_sticker.user_id = ?;
    `
    const [selectUserStickerRow] = await connection.query(selectUserStickerQuery,user_id);
    return selectUserStickerRow[0];
};

export const selectVisitorStickers = async(connection, user_id) =>{
    const selectVisitorStickersQuery = `
        SELECT visitor_id, image_url, seen, location_x, location_y
        FROM final_image
        JOIN visitor_sticker on final_image.final_image_id = visitor_sticker.final_image_id
        WHERE visitor_sticker.host_id = ?;
    `
    const [selectVisitorStickersRow] = await connection.query(selectVisitorStickersQuery,user_id);
    return selectVisitorStickersRow;
};

export const getIdByNickname = async(connection, nickname) =>{
    const getIdByNicknameQuery = `
        SELECT user_id
        FROM user_poster
        WHERE nickname = ?;
    `
    const [getIdByNicknameRow] = await connection.query(getIdByNicknameQuery,nickname);
    return getIdByNicknameRow[0];
}

