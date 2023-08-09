export const userDao = {
    selectUser : async(connection, user_id) =>{ //user_id로 유저 조회
        const selectUserQuery = `
            SELECT *
            FROM user
            WHERE user_id = ?;
        `
        const [selectUserRow] = await connection.query(selectUserQuery,user_id);
        return selectUserRow[0];
    },
    
    getIdByNickname : async(connection, nickname) =>{ //닉네임으로 회원 번호 조회
        const getIdByNicknameQuery = `
            SELECT user_id
            FROM user_poster
            WHERE nickname = ?;
        `
        const [getIdByNicknameRow] = await connection.query(getIdByNicknameQuery,nickname);
        return getIdByNicknameRow[0];
    },

    getNicknameById : async(connection, user_id) =>{ //회원 번호로 닉네임 조회
        const getNicknameByIdQuery = `
            SELECT nickname
            FROM user_poster
            WHERE user_id = ?;
        `
        const [getNicknameByIdRow] = await connection.query(getNicknameByIdQuery,user_id);
        return getNicknameByIdRow;
    }
};

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
    updateUserMessage : async(connection,userId, message) =>{ //방문자에게 보여줄 한 마디 등록
        const insertUserMessageQuery = `
            UPDATE user_sticker
            SET message = ?
            WHERE user_id = ?;
        `
        const [insertUserMessageRow] = await connection.query(insertUserMessageQuery,[message,userId]);
        return insertUserMessageRow;
    },
    updateVisitorMessage : async(connection,params)=>{ //방문자 메세지 등록
        const insertVisitorMessageQuery = `
            UPDATE visitor_sticker
            SET message = ?
            WHERE visitor_sticker_id = ?;
        `
        const [insertVisitorMessageRow] = await connection.query(insertVisitorMessageQuery,params);
        return insertVisitorMessageRow;
    },
    updateStickerLocation : async(connection, params) =>{ //방문자 스티커 위치 등록
        const insertStickerLocationQuery = `
            UPDATE visitor_sticker
            SET location_x = ?,  location_y = ?
            WHERE visitor_sticker_id = ?;
        `
        const [insertStickerLocationRow] = await connection.query(insertStickerLocationQuery, params);
        return insertStickerLocationRow;
    },
    selectUserStickerDetails : async(connection,userId) =>{
        const selectUserStickerDetailsQuery = `
            SELECT face_id, eyes_id, nose_id, mouth_id, arm_id, foot_id, accessory_id
            FROM user_sticker
            WHERE user_id = ?;
        `
        const [selectUserStickerDetailsRow] = await connection.query(selectUserStickerDetailsQuery,userId);
        return selectUserStickerDetailsRow;
    },
    updateFace : async(connection, params) =>{
        const updateFaceQuery = `
            UPDATE user_sticker
            SET face_id = ?
            WHERE user_id = ?;
        `
        const [updateFaceRow] = await connection.query(updateFaceQuery,params);
        return updateFaceRow;
    },
    updateEyes : async(connection, params)=>{
        const updateEyesQuery = `
            UPDATE user_sticker
            SET eyes_id = ?
            WHERE user_id = ?;
        `
        const [updateEyesRow] = await connection.query(updateEyesQuery,params);
        return updateEyesRow;
    },
    updateNose : async(connection, params)=>{
        const updateNoseQuery = `
            UPDATE user_sticker
            SET nose_id = ?
            WHERE user_id = ?;
        `
        const [udpateNoseRow] = await connection.query(updateNoseQuery,params);
        return udpateNoseRow;
    },
    updateMouth : async(connection, params) =>{
        const updateMouthQuery = `
            UPDATE user_sticker
            SET mouth_id = ?
            WHERE user_Id = ?;
        `
        const [updateMouthRow] = await connection.query(updateMouthQuery,params);
        return updateMouthRow;
    },
    updateArm : async(connection, params) =>{
        const updateArmQuery = `
            UPDATE user_sticker
            SET arm_id = ?
            WHERE user_id = ?;
        `
        const [updateArmRow] = await connection.query(updateArmQuery,params);
        return updateArmRow;
    },
    updateFoot : async(connection, params) =>{
        const updateFootQuery = `
            UPDATE user_sticker
            SET foot_id = ?
            WHERE user_id = ?;
        `
        const [updateFootRow] = await connection.query(updateFootQuery,params);
        return updateFootRow;
    },
    updateAccessory : async(connection, params) =>{
        const updateAccessoryQuery = `
            UPDATE user_sticker
            SET accessory_id = ?
            WHERE user_id = ?;
        `
        const [updateAccessoryRow] = await connection.query(updateAccessoryQuery,params);
        return updateAccessoryRow;
    },
    updateVisitorName : async(connection,id,name) =>{
        const updateVisitorNameQuery = `
            UPDATE visitor_sticker
            SET name = ?
            WHERE visitor_sticker_id = ?;
        `
        const [updateVisitorNameRow] = await connection.query(updateVisitorNameQuery,[name,id]);
        return updateVisitorNameRow;
    }
}

export const nqnaDao = {
    insertDefaultQuestion : async(connection, insertDefaultQuestionParams) => { // default 질문 생성
        const postDefaultQuestionQuery = `
            INSERT INTO nQnA(user_id, question, question_type) 
            VALUES (?,?,"default");
    
        `;
        const insertDefaultQuestionRow = await connection.query(postDefaultQuestionQuery, insertDefaultQuestionParams);
        return insertDefaultQuestionRow;
    },

    insertVisitorQuestion : async(connection, insertDefaultQuestionParams) => { // visitor 질문 생성
        const postVisitorQuestionQuery = `
            INSERT INTO nQnA(user_id, question, question_type,visitor_id) 
            VALUES (?,?,"visitor",?);
    
        `
        const insertVisitorQuestionRow = await connection.query(postVisitorQuestionQuery, insertDefaultQuestionParams);
        return insertVisitorQuestionRow;
    },

    insertAnswer : async(connection, insertAnswerParams) => { // 답변 생성 + 수정
        const postAnswerQuery = `
            UPDATE nQnA 
            SET answer= ?
            WHERE nQnA_id =?;
        `;
        const insertAnswerRow = await connection.query(postAnswerQuery, insertAnswerParams);
        return insertAnswerRow;
    },

    selectNQnA : async(connection,nQnA_id)=>{ // nQnA 개별 조회
        const selectNQnAQuery = `
            SELECT *
            FROM nQnA
            WHERE nQnA_id = ?;
        `
        const [selectNQnARow] = await connection.query(selectNQnAQuery,nQnA_id);
        return selectNQnARow;
    },

    selectHostNQnA : async(connection,user_id)=>{ // 호스트 플로우 답변 + 질문 조회
        const selectHostNQnAQuery = `
            SELECT nQnA_id, question, question_type, question_hidden, answer, answer_hidden
            FROM nQnA
            ORDER BY answer_created
            WHERE user_id = ?;
        `
        const [selectHostNQnARow] = await connection.query(selectHostNQnAQuery,user_id);
        return selectHostNQnARow;
    },

    selectHostQ : async(connection,user_id)=>{ // 호스트 플로우 미답변 질문 조회
        const selectHostQQuery = `
            SELECT nQnA_id, question, question_type, question_hidden
            FROM nQnA
            ORDER BY question_created
            WHERE user_id = ?;
        `
        const [selectHostQRow] = await connection.query(selectHostQQuery,user_id);
        return selectHostQRow;
    },

    selectVisitorNQnA : async(connection,user_id)=>{ // 방문자 플로우 nQnA 전체 조회
        const selectVisitorNQnAQuery = `
            SELECT nQnA_id, question, question_hidden, answer, answer_hidden, question_created
            FROM nQnA
            WHERE user_id = ?;
        `
        const [selectVisitorNQnARow] = await connection.query(selectVisitorNQnAQuery,user_id);
        return selectVisitorNQnARow;
    },

    updateQuestionHidden : async(connection, updateQuestionHiddenParams) =>{ // 질문 공개 여부 수정
        const patchQuestionHiddenQuery = `
            UPDATE nQnA 
            SET question_hidden= ?
            WHERE nQnA_id =?;
        `
        const updateQuestionHiddenRow = await connection.query(patchQuestionHiddenQuery, updateQuestionHiddenParams);
        return updateQuestionHiddenRow;
    },

    updateAnswerHidden : async(connection, updateAnswerHiddenParams) =>{ // 답변 공개 여부 수정
        const patchAnswerHiddenQuery = `
            UPDATE nQnA 
            SET answer_hidden= ?
            WHERE nQnA_id =?;
        `
        const updateAnswerHiddenRow = await connection.query(patchAnswerHiddenQuery, updateAnswerHiddenParams);
        return updateAnswerHiddenRow;
    },

    selectEmptyAnswer : async(connection,user_id)=>{ // 미답변 질문 개수 조회
        const selectEmptyAnswerQuery = `
            SELECT COUNT(*) AS emptyanswer
            FROM nQnA
            WHERE user_id = ? AND answer IS NULL ;
        `
        const [selectEmptyAnswerRow] = await connection.query(selectEmptyAnswerQuery,user_id);
        return selectEmptyAnswerRow; 
    },

    selectVisitorQuestion : async(connection,selectVisitorQuestionParms)=>{ // (방문자 플로우) 로그인한 방문자가 남긴 질문 조회
        const selectVisitorQuestionQuery = `
        SELECT nQnA_id, question, visitor_id
        FROM nQnA
        WHERE user_id = ? AND visitor_id = ?;
        `
        const [selectVisitorQuestionQueryRow] = await connection.query(selectVisitorQuestionQuery,selectVisitorQuestionParms);
        return selectVisitorQuestionQueryRow; 
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
                INSERT INTO user_poster(user_id, nickname, q_season,q_number,q_date,q_important,chinese,pronunciation,meaning)
                VALUES(?,?,?,?,?,?,?,?,?);
            `
            const [insertPosterRow] = await connection.query(insertPosterQuery,params);
            return insertPosterRow;
        }catch(err){
            return err;
        }
    },
    updateSeason : async(connection, params) =>{
        const updateSeasonQuery = `
            UPDATE user_poster
            SET q_season = ?
            WHERE user_id = ?;
        `
        const [updateSeasonRow] = await connection.query(updateSeasonQuery,params);
        return updateSeasonRow;
    },
    updateNumber : async(connection, params) =>{
        const updateNumberQuery = `
            UPDATE user_poster
            SET q_number = ?
            WHERE user_id = ?;
        `
        const [updateNumberRow] = await connection.query(updateNumberQuery, params);
        return updateNumberRow;
    },
    updateDate : async(connection, params) =>{
        const updateDateQuery = `
            UPDATE user_poster
            SET q_date = ?
            WHERE user_id = ?;
        `
        const [updateDateRow] = await connection.query(updateDateQuery,params);
        return updateDateRow;
    },
    updateImporant : async(connection, params) =>{
        const updateImporantQuery = `
            UPDATE user_poster
            SET q_important = ?, chinese = ?, pronunciation = ?, meaning = ?
            WHERE user_id = ?;
        `
        const [updateImporantRow] = await connection.query(updateImporantQuery, params);
        return updateImporantRow;
    }
}