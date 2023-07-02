const baseResponse = {
    //Success
    SUCCESS : {"isSuccess": true,"code":1000, "message":"성공"},

    //Social KAKAO
    SIGNUP_KAKAO_EXUSER : {"isSuccess":true, "code":2000, "message":"이미 가입된 사용자입니다"},
    SIGNUP_KAKAO_NEWUSER: {"isSUcess":true, "code":2001, "message": "새로운 사용자입니다"},

    //Social Google
    SIGNUP_GOOGLE_EXUSER : {"isSuccess":true, "code":3000, "message":"이미 가입된 사용자입니다"},
    SIGNUP_GOOGLE_NEWUSER: {"isSUccess":true, "code":3001, "message":"새로운 사용자입니다"},
};


export default baseResponse;