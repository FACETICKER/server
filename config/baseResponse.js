const baseResponse = {
    
    //Success
    SUCCESS : {"isSuccess": true,"code":1000, "message":"성공"},
    HOST: {"isSuccess": true, "code":1001, "message":"호스트입니다"},
    VISITOR: {"isSuccess":true, "code":1002, "message":"방문자입니다"},

    //로그인 2000번
    SIGNUP_KAKAO_EXUSER : {"isSuccess":true, "code":2000, "message":"이미 가입된 사용자입니다"},
    SIGNUP_KAKAO_NEWUSER: {"isSuccess":true, "code":2001, "message": "새로운 사용자입니다"},
    SIGNUP_GOOGLE_EXUSER : {"isSuccess":true, "code":2002, "message":"이미 가입된 사용자입니다"},
    SIGNUP_GOOGLE_NEWUSER: {"isSuccess":true, "code":2003, "message":"새로운 사용자입니다"},
    SIGNIN_NOT_SIGNIN : { "isSuccess": false, "code": 2004, "message": "로그인하지 않은 사용자입니다." },
    
    //유저 관련 오류 3000번
    USER_USERID_EMPTY : { "isSuccess": false, "code": 3000, "message": "user_id를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 3001, "message": "해당 유저가 존재하지 않습니다." },
    USER_USERID_NOT_MATCH : {"isSuccess":false, "code":3002, "message":"user_id 값을 확인해주세요."},
    USER_NICKNAME_DUPLICATED : {"isSuccess":false, "code":3003, "message":"닉네임이 이미 존재합니다"},
    USER_NOT_HOST : {"isSuccess" : false, "code" : 3004, "message":"호스트가 아닙니다"},

    //스티커 관련 오류 4000번
    STICKER_STICKERID_NOT_EXIST : { "isSuccess": false, "code": 4000, "message": "해당 스티커가 존재하지 않습니다." },

    //질문 관련 오류 5000번
    NQNA_QUESTION_NOT_EXIST : { "isSuccess": false, "code": 5000, "message": "질문이 존재하지 않습니다." },
    NQNA_ANSWER_NOT_EXIST : { "isSuccess": false, "code": 5001, "message": "답변이 존재하지 않습니다." },
    NQNA_QUESTION_EMPTY : { "isSuccess": false, "code": 5002, "message":"질문을 입력해주세요" },
    NQNA_ANSWER_EMPTY : { "isSuccess": false, "code": 5003, "message":"답변을 입력해주세요" },
    NQNA_QUESTION_LENGTH : { "isSuccess": false, "code": 5004, "message":"질문은 100자리 미만으로 입력해주세요." },
    NQNA_ANSWER_LENGTH : { "isSuccess": false, "code": 5005, "message":"답변은 100자리 미만으로 입력해주세요." },
    NQNA_VISITOR_QUESTION_NOT_EXIST : { "isSuccess": false, "code": 5000, "message": "방문자의 질문이 존재하지 않습니다." },


    //토큰 6000번
    TOKEN_EMPTY : { "isSuccess": false, "code": 6000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 6001, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 6002, "message":"JWT 토큰 검증 성공" }, // ?
    

    //Connection, Transaction 등의 서버 오류 9000번
    DB_ERROR : { "isSuccess": false, "code": 9000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 9001, "message": "서버 에러"},


};


export default baseResponse;