export const getIdByNickname = async(connection, nickname) =>{ //닉네임으로 회원 번호 조회
    const getIdByNicknameQuery = `
        SELECT user_id
        FROM user_poster
        WHERE nickname = ?;
    `
    const [getIdByNicknameRow] = await connection.query(getIdByNicknameQuery,nickname);
    return getIdByNicknameRow[0];
}
export const getNicknameById = async(connection, user_id) =>{ //회원 번호로 닉네임 조회
    console.log(user_id);
    const getNicknameByIdQuery = `
        SELECT nickname
        FROM user_poster
        WHERE user_id = ?;
    `
    const [getNicknameByIdRow] = await connection.query(getNicknameByIdQuery,user_id);
    return getNicknameByIdRow;
}

export const loginDao = {
    findUser : async(connection, userInfoParams)=>{ //사용자 조회
        const findUserQuery = `
        SELECT user_id, user_email, provider, COUNT(*) as count
        FROM user
        WHERE user_email = ?
        AND provider = ?
        GROUP BY user_id, user_email, provider;
        `
        const [findUserRow] = await connection.query(findUserQuery,userInfoParams);
        return findUserRow[0];
    },
    createUser : async(connection,userInfoParams) =>{ //사용자 등록
        const createUserQuery = `
        INSERT INTO user(user_email, provider)
        VALUES(?,?);
        `
        const createUserRow = await connection.query(createUserQuery,userInfoParams);
        return createUserRow[0];
    },
}

export const stickerDao = {
    selectVisitorStickerById : async(connection, visitor_sticker_id)=>{ //방문자 스티커 개별 조회
        const selectVisitorStickerIdQuery = `
            SELECT final_image.image_url, visitor_sticker.name, visitor_sticker.message, visitor_sticker.visitor_id
            FROM visitor_sticker
            INNER JOIN final_image
            ON visitor_sticker.final_image_id = final_image.final_image_id
            WHERE visitor_sticker_id = ?;
        `;
        const [userRow] = await connection.query(selectVisitorStickerIdQuery, visitor_sticker_id);
        return userRow;
    },
    selectUserSticker : async(connection,user_id) =>{ //호스트 스티커 조회
        const selectUserStickerQuery = `
            SELECT user_id, image_url
            FROM final_image
            JOIN user_sticker ON final_image.final_image_id = user_sticker.final_image_id
            WHERE user_sticker.user_id = ?;
        `
        const [selectUserStickerRow] = await connection.query(selectUserStickerQuery,user_id);
        return selectUserStickerRow;
    },
    selectVisitorStickers : async(connection, user_id) =>{ //모든 방문자 스티커 조회
        const selectVisitorStickersQuery = `
            SELECT visitor_sticker_id, image_url, seen, location_x, location_y
            FROM final_image
            JOIN visitor_sticker on final_image.final_image_id = visitor_sticker.final_image_id
            WHERE visitor_sticker.host_id = ?;
        `
        const [selectVisitorStickersRow] = await connection.query(selectVisitorStickersQuery,user_id);
        return selectVisitorStickersRow;
    },
    createUserSticker : async(connection, params) =>{ //호스트 스티커 등록
        const insertUserStickerQuery = `
            INSERT INTO user_sticker(user_id, face_id, nose_id, eyes_id, mouth_id, arm_id, foot_id, accessory_id)
            VALUES(?,?,?,?,?,?,?,?);
        `
        const [insertUserStickerRow] = await connection.query(insertUserStickerQuery,params);
        return insertUserStickerRow;
    },
    createVisitorSticker : async(connection,params) =>{ //방문자 스티커 등록
        const insertVisitorStickerQuery = `
            INSERT INTO visitor_sticker(host_id, visitor_id, face_id, nose_id, eyes_id, mouth_id, arm_id, foot_id, accessory_id)
            VALUES(?,?,?,?,?,?,?,?,?);
        `
        const [insertVisitorStickerRow] = await connection.query(insertVisitorStickerQuery,params);
        return insertVisitorStickerRow;
    },
    selectNewSticker : async(connection,user_id)=>{ //새로운 스티커 수 조회
        const selectNewStickerQuery = `
            SELECT COUNT(*) as count
            FROM visitor_sticker
            WHERE seen = false
            AND host_id = ?;
        `
        const [selectNewStickerRow] = await connection.query(selectNewStickerQuery,user_id);
        return selectNewStickerRow;
    },
    insertUserMessage : async(connection,userId, message) =>{ //방문자에게 보여줄 한 마디 등록
        const insertUserMessageQuery = `
            UPDATE user_sticker
            SET message = ?
            WHERE user_id = ?;
        `
        const [insertUserMessageRow] = await connection.query(insertUserMessageQuery,[message,userId]);
        return insertUserMessageRow;
    },
    insertVisitorMessage : async(connection,params)=>{ //방문자 메세지 등록
        const insertVisitorMessageQuery = `
            UPDATE visitor_sticker
            SET name = ? , message = ?
            WHERE visitor_sticker_id = ?;
        `
        const [insertVisitorMessageRow] = await connection.query(insertVisitorMessageQuery,params);
        return insertVisitorMessageRow;
    },
    insertStickerLocation : async(connection, params) =>{ //방문자 스티커 위치 등록
        const insertStickerLocationQuery = `
            UPDATE visitor_sticker
            SET location_x = ?,  location_y = ?
            WHERE visitor_sticker_id = ?;
        `
        const [insertStickerLocationRow] = await connection.query(insertStickerLocationQuery, params);
        return insertStickerLocationRow;
    }
    
}

export const nqnaDao = {
    selectDefaultQuestions : async(connection, default_q_id)=>{ // default 질문 조회 (전체 조회 + 개별 조회)

        if(default_q_id == null){ // default 질문 전체 조회
            const selectDefaultQuestionsQuery = `
                SELECT default_q_id, question
                FROM default_q;
            `;
            const [DefaultQuestionsRow] = await connection.query(selectDefaultQuestionsQuery);
    
            return DefaultQuestionsRow;
        }
        else{ // default 질문 default_q_id로 개별 조회
            const selectDefaultQuestionsQuery = `
                SELECT default_q_id, question
                FROM default_q
                WHERE default_q_id = ?;
            `;
            const [DefaultQuestionsRow] = await connection.query(selectDefaultQuestionsQuery,default_q_id);
    
            return DefaultQuestionsRow;
        }
    },
    insertDefaultQuestion : async(connection, insertDefaultQuestionParams) => {
        const postDefaultQuestionQuery = `
            INSERT INTO nQnA(user_id, question, question_type) 
            VALUES (?,?,0);
    
        `;
        const insertDefaultQuestionRow = await connection.query(postDefaultQuestionQuery, insertDefaultQuestionParams);
        return insertDefaultQuestionRow;
    },
}

export const posterDao = {
    selectPoster : async(connection,user_id)=>{ //포스터 정보 조회
        const selectPosterQuery = `
            SELECT *
            FROM user_poster
            WHERE user_id = ?;
        `
        const [selectPosterRow] = await connection.query(selectPosterQuery,user_id);
        return selectPosterRow;
    },
    insertPoster : async(connection, params) =>{
        try{
            const insertPosterQuery = `
                INSERT INTO user_poster(user_id, nickname, q_season,q_number,q_date,q_important)
                VALUES(?,?,?,?,?,?);
            `
            const [insertPosterRow] = await connection.query(insertPosterQuery,params);
            return insertPosterRow;
        }catch(err){
            return err;
        }
    }
}



