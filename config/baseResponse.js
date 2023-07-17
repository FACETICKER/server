const baseResponse = {
    //Success
    SUCCESS : {"isSuccess": true,"code":1000, "message":"성공"},

    //Social KAKAO
    SIGNUP_KAKAO_EXUSER : {"isSuccess":true, "code":2000, "message":"이미 가입된 사용자입니다"},
    SIGNUP_KAKAO_NEWUSER: {"isSuccess":true, "code":2001, "message": "새로운 사용자입니다"},

    //Social Google
    SIGNUP_GOOGLE_EXUSER : {"isSuccess":true, "code":3000, "message":"이미 가입된 사용자입니다"},
    SIGNUP_GOOGLE_NEWUSER: {"isSuccess":true, "code":3001, "message":"새로운 사용자입니다"},
    
    //유저 관련 오류
    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "user_id를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 유저가 존재하지 않습니다." },

    //스티커 관련 오류
    STICKER_STICKERID_NOT_EXIST : { "isSuccess": false, "code": 3012, "message": "해당 스티커가 존재하지 않습니다." },
    
    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},


};


export default baseResponse;