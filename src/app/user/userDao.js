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
}