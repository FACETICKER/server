import {response, errResponse} from "../../../config/response.js";
import baseResponse from "../../../config/baseResponse.js";
import { userCheck, stickerProvider, posterProvider, userProvider, nqnaProvider } from "./userProvider.js";
import {loginDao,nqnaDao, stickerDao, posterDao } from "./userDao.js";
import pool from "../../../config/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { nqnaController } from "./userController.js";
dotenv.config();

export const loginService = { //로그인 서비스
    kakao: async(userInfo, provider) =>{
        try{
            //기존의 사용자인지 확인
            const userInfoParams = [`${userInfo.email}`, `${provider}`];
            const exUser = await userCheck(userInfoParams); //기존의 사용자인지 확인
            if(exUser){
                //토큰 발급
                let token = jwt.sign({
                    user_id : exUser.user_id,
                    user_email : userInfo.email,
                },
                process.env.JWT_SECRET,{
                    expiresIn: "1h",
                });
                return response(baseResponse.SIGNUP_KAKAO_EXUSER,{'user_id':exUser.user_id,'jwt':token});
            }
            else{ //기존의 사용자가 아니면 새로운 사용자 추가
                const connection = await pool.getConnection(async conn => conn); //pool 연결 설정
                const newUserResponse = await loginDao.createUser(connection,userInfoParams); 
                connection.release();
                //토큰 발급
                if(newUserResponse.affectedRows === 1){ //성공적으로 DB에 추가됐으면 토큰 발급
                    let token = jwt.sign({
                        user_id : newUserResponse.insertId,
                        user_email: userInfo.email,
                    },process.env.JWT_SECRET,{
                        expiresIn: "1h",
                    });
                    return response(baseResponse.SIGNUP_KAKAO_NEWUSER,{'user_id':newUserResponse.insertId,'jwt':token});//회원 번호하고 토큰 반환
                };
            }
        }catch(err){
            console.error(err);
            return errResponse(baseResponse.DB_ERROR);
        }
    },
    google: async(userInfo, provider) =>{
        try{
            const userInfoParams = [`${userInfo.email}`, `${provider}`];
            const exUser = await userCheck(userInfoParams); //기존의 사용자인지 확인
            if(exUser){ //기존의 사용자면 토큰 발급
                let token = jwt.sign({
                    user_id : exUser.user_id,
                    user_email: userInfo.email,
                },process.env.JWT_SECRET,{
                    expiresIn: "1h",
                });
                return response(baseResponse.SIGNUP_GOOGLE_EXUSER,{'user_id':exUser.user_id,'jwt':token}); //회원 번호하고 토큰 반환
            }
            else{ //기존의 사용자가 아니므로 DB에 새로운 사용자 추가
                const connection = await pool.getConnection(async conn => conn); //pool 연결 설정
                const newUserResponse = await loginDao.createUser(connection,userInfoParams); 
                connection.release();
                if(newUserResponse.affectedRows === 1){ //성공적으로 DB에 추가됐으면 토큰 발급
                    let token = jwt.sign({
                        user_id : newUserResponse.insertId,
                        user_email: userInfo.email,
                    },process.env.JWT_SECRET,{
                        expiresIn: "1h",
                    });
                    return response(baseResponse.SIGNUP_GOOGLE_NEWUSER,{'user_id':newUserResponse.insertId,'jwt':token});//회원 번호하고 토큰 반환
                };
            };
        }catch(err){
            console.error(err);
            return errResponse(baseResponse.DB_ERROR);
        }
    },
};

export const stickerService = { //스티커 관련 서비스
    getStickersByType : async(params) =>{ //스티커 조회 + 호스트/방문자 구별 
    try{
        const stickerCollections = await stickerProvider.StickerCollections(params.user_id); //해당 페이지의 모든 스티커를 조회
        if(params.userIdFromJWT === params.user_id){ //만약 토큰이 있을 경우 회원 번호가 같으면 호스트 아니면 방문자
            return response(baseResponse.HOST,stickerCollections);
        }else{
            return response(baseResponse.VISITOR,stickerCollections);
        }
    }catch(err){
        console.error(err);
        }
    },
    insertUserSticker : async(params) =>{ //호스트 스티커 등록
        try{
            const connection = await pool.getConnection(async conn=> conn);
            const insertUserStickerResult = await stickerDao.createUserSticker(connection,params);
            connection.release();
            if(insertUserStickerResult.affectedRows === 1){
                return response(baseResponse.SUCCESS);
            }else{
                return response(baseResponse.DB_ERROR);
            }
        }catch(err){
            console.error(err);
        }
    },
    insertVisitorSticker : async(params) =>{ //방문자 스티커 등록
        try{
            const connection = await pool.getConnection(async conn => conn);
            const createVisitorStickerResult = await stickerDao.createVisitorSticker(connection,params);
            connection.release();
            if(createVisitorStickerResult.affectedRows === 1){
                return response(baseResponse.SUCCESS,{'visitor_id':createVisitorStickerResult.insertId});
            }else return response(baseResponse.DB_ERROR);
        }catch(err){
            console.error(err);
        }
    },
    updateUserMessage : async(userId, message) =>{ //사용자 메세지 등록
        try{
            const connection = await pool.getConnection(async conn => conn);
            const insertUserMessageResult = await stickerDao.updateUserMessage(connection,userId,message);
            if(insertUserMessageResult.affectedRows === 1){
                return response(baseResponse.SUCCESS);
            }else return response(baseResponse.DB_ERROR);
        }catch(err){
            console.error(err);
        }
    },
    updateVisitorMessage : async(visitorId, message) =>{ //방문자 메세지 등록
        try{
            const connection = await pool.getConnection(async conn => conn);
            const params = [message,visitorId];
            const insertVisitorMessageResult = await stickerDao.updateVisitorMessage(connection,params);
            connection.release();
            if(insertVisitorMessageResult.affectedRows===1){
                return response(baseResponse.SUCCESS);
            }else return response(baseResponse.DB_ERROR);
        }catch(err){
            console.error(err);
        }
    },
    insertStickerLocation : async(params) =>{ //방문자 스티커 부착 위치 등록
        try{
            const connection = await pool.getConnection(async conn => conn);
            const insertStickerLocationResult = await stickerDao.updateStickerLocation(connection,params);
            connection.release();
            if(insertStickerLocationResult.changedRows === 1 && insertStickerLocationResult.affectedRows===1){
                return response(baseResponse.SUCCESS);
            }else return response(baseResponse.DB_ERROR);
        }catch(err){
            console.error(err);
        }
    },
    patchStickerLocation : async(params) =>{
        const connection = await pool.getConnection(async conn=> conn);
        const patchStickerLocation = await stickerDao.updateStickerLocation(connection,params);
        connection.release();
        if(patchStickerLocation.affectedRows===1){
            return "success";
        }else return "fail";
    },
    updateUserSticker : async(params) =>{
        const connection = await pool.getConnection(async conn => conn);
        const updateResult = await stickerDao.updateUserSticker(connection,params);
        connection.release();
        if(updateResult.affectedRows === 1){
            return "success";
        }else return "fail";
    },
    updateVisitorName : async(id,name)=>{
        const connection = await pool.getConnection(async conn => conn);
        const updateResult = await stickerDao.updateVisitorName(connection,id,name);
        connection.release();
        if(updateResult.affectedRows === 1){
            return "success";
        }
        else return "fail";

    },

    deleteVisitorSticker : async(visitor_sticker_id) =>{ // 방문자 스티커 삭제

        const connection = await pool.getConnection(async conn => conn);
        const deleteVisitorStickerResult = await stickerDao.deleteVisitorSticker(connection,visitor_sticker_id);
        console.log(deleteVisitorStickerResult);
        connection.release();
        
        return response(baseResponse.SUCCESS);  
    }
};

export const nqnaService = { //n문n답 관련 서비스
    createDefaultQuestion : async(user_id,question) =>{ // default 질문 생성
        try{
            
            const insertDefaultQuestionParams =[user_id,question]; 
        
            const connection = await pool.getConnection(async conn => conn);
            const createDefaultQuestionResult = await nqnaDao.insertDefaultQuestion(connection,insertDefaultQuestionParams);
            console.log(createDefaultQuestionResult);
            connection.release();
            
            return response(baseResponse.SUCCESS);
        }
        catch(error){
            console.log(error);
            return errResponse(baseResponse.DB_ERROR)
        }
    },

    createVisitorQuestion : async(user_id,question,userIdFromJWT) =>{ // visitor 질문 생성
        try{
            const insertVisitorQuestionParams =[user_id,question,userIdFromJWT]; 
            const connection = await pool.getConnection(async conn => conn);
            const createVisitorQuestionResult = await nqnaDao.insertVisitorQuestion(connection,insertVisitorQuestionParams);
            console.log(createVisitorQuestionResult);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
        catch(error){
            console.log(error);
            return errResponse(baseResponse.DB_ERROR)
        }
    },

    createAnswer : async(answer,nQnA_id) =>{ // 답변 등록 + 수정

        try{
            const insertAnswerParams =[answer,nQnA_id]; 
        
            const connection = await pool.getConnection(async conn => conn);
            const createAnswerResult = await nqnaDao.insertAnswer(connection,insertAnswerParams);
            console.log(createAnswerResult);
            connection.release();
            
            return response(baseResponse.SUCCESS);
        }
        catch(error){
            console.log(error);
            return errResponse(baseResponse.DB_ERROR)
        }
    },

    editnQuestionHidden : async(nQnA_id, question_hidden) =>{ // 질문 공개 여부 수정 

        try{    
            const updateQuestionHiddenParams = [question_hidden, nQnA_id];

            const connection = await pool.getConnection(async conn => conn);
            const editQuestionHiddenResult = await nqnaDao.updateQuestionHidden(connection,updateQuestionHiddenParams);
            console.log(editQuestionHiddenResult);
            connection.release();
            
            return response(baseResponse.SUCCESS);
        }
        catch(error){
            console.log(error);
            return errResponse(baseResponse.DB_ERROR)
        }
    },

    editnAnswerHidden : async(nQnA_id, answer_hidden) =>{ // 답변 공개 여부 수정 

        try{    
            const updateAnswerHiddenParams = [answer_hidden, nQnA_id];

            const connection = await pool.getConnection(async conn => conn);
            const editnAnswerHiddenResult = await nqnaDao.updateAnswerHidden(connection,updateAnswerHiddenParams);
            console.log(editnAnswerHiddenResult);
            connection.release();
            
            return response(baseResponse.SUCCESS);
        }
        catch(error){
            console.log(error);
            return errResponse(baseResponse.DB_ERROR)
        }
    },

    deleteAnswer : async(nQnA_id) =>{ // 답변 삭제
        const connection = await pool.getConnection(async conn => conn);
        const deleteAnswerResult = await nqnaDao.deleteAnswer(connection,nQnA_id);
        console.log(deleteAnswerResult);
        connection.release();
        
        return response(baseResponse.SUCCESS);
        
    },

    deleteQuestion : async(nQnA_id) =>{ // 질문 삭제
        const connection = await pool.getConnection(async conn => conn);
        const deleteQuestionResult = await nqnaDao.deleteQuestion(connection,nQnA_id);
        console.log(deleteQuestionResult);
        connection.release();
        
        return response(baseResponse.SUCCESS);
        
    },
};

export const mainpageService = async(userIdFromJWT,user_id) =>{
    const check = await userProvider.retrieveUser(user_id);
    if(!check) return response(baseResponse.USER_USERID_NOT_EXIST);
    const poster = await posterProvider.poster(user_id);
    const sticker = await stickerProvider.userSticker(user_id);
    const newSticker = await stickerProvider.newStickers(user_id);
    const newQuestion = await nqnaProvider.retrieveEmptyAnswer(user_id);
    if(userIdFromJWT == user_id){ //사용자가 본인 페이지에 들어갔을 경우
        const result = {
            poster:poster,
            sticker:sticker,
            newSticker:newSticker,
            newQuestion: newQuestion,
        };
        return response(baseResponse.HOST,result); 
    }else{ //방문자가 다른 사용자 페이지에 방문했을 경우
        const result = {
            userId: userIdFromJWT, //본인 프로필으로 돌아갈 경우를 위해
            hostPoster: poster,
            hostSticker:sticker,
            hostnewSticer : newSticker,
            howtnewQuestion : newQuestion
        };
        return response(baseResponse.VISITOR,result);
    }
};

export const posterService = {
    insertPoster : async(params) =>{
        const connection = await pool.getConnection(async conn => conn);
        const insertPosterResult = await posterDao.insertPoster(connection,params);
        connection.release();
        if(insertPosterResult.affectedRows===1){
            return response(baseResponse.SUCCESS);
        }else return response(baseResponse.DB_ERROR);
    },
    updatePoster : async(params) =>{
        const connection = await pool.getConnection(async conn => conn);
        const updateResult = await posterDao.updatePoster(connection,params);
        connection.release();
        if(updateResult.affectedRows === 1){
            return "success";
        }
        else return "fail";
    },
    updateChinese : async(params) =>{
        const connection = await pool.getConnection(async conn => conn);
        const updateResult = await posterDao.updateChinese(connection,params);
        connection.release();
        if(updateResult.affectedRows === 1){
            return "success";
        }
        else return "fail";
    }
};


export const chineseDict = (important) =>{ //사자성어 생성
    let Dict;
    if(important=='사랑'){
        Dict = [
            {chinese: '寤寐不忘', pronunciation: '오매불망', meaning: '자나깨나 잊지 못함'},
            {chinese: '寤寐思服', pronunciation: '오매사복', meaning: '자나깨나 생각하는 것'},
            {chinese: '戀戀不忘', pronunciation: '연연불망', meaning: '그리워서 잊지 못함'},
            {chinese: '意中之人', pronunciation: '의중지인', meaning: '마음속에 품고 그리워하는 사람'},
            {chinese: '戀慕之情', pronunciation: '연모지정', meaning: '사랑하여 그리워하는 정'},
            {chinese: '三秋之思', pronunciation: '삼추지사', meaning: '몹시 사모하여 기다리는 마음'},
            {chinese: '念念不忘', pronunciation: '염념불망', meaning: '자꾸 생각나서 잊지 못함'},
            {chinese: '天生緣分', pronunciation: '천생연분', meaning: '하늘에서 정해 준 연분'},
            {chinese: '落花流水', pronunciation: '낙화유수', meaning: '남녀 간 서로 그리워하는 애틋한 정'},
            {chinese: '擲果滿車', pronunciation: '척과만거', meaning: '여성이 남성에게 사랑을 고백함'},
            {chinese: '你可昭綏', pronunciation: '니가조타', meaning: '좋아하는 마음을 고백함'},
            {chinese: '昭我偕耀', pronunciation: '조아해요', meaning: '좋아하는 마음을 고백함'},
            {chinese: '氣麗云你', pronunciation: '기여운너', meaning: '네가 뭐만 해도 귀여워 보임'},
            {chinese: '娜圖昭湛', pronunciation: '나도조음', meaning: '아름다움이 밝게 빛나는 네가 좋음'},
            {chinese: '友鄰因緣', pronunciation: '우린인연', meaning: '서로의 관계를 확인하는 말'},
            {chinese: '思浪海照', pronunciation: '사랑해조', meaning: '사랑을 받고 싶어하는 마음'},
            {chinese: '所重憪恁', pronunciation: '소중한님', meaning: '언제나 당신만을 생각함'},
            {chinese: '寶考時捕', pronunciation: '보고시포', meaning: '몹시 그리워하는 마음'},
            {chinese: '乃据解剌', pronunciation: '내거해라', meaning: '마음에 드는 이에게 사랑을 고백함'},
            {chinese: '電話曷來', pronunciation: '전화할래', meaning: '상대 목소리를 너무나도 듣고 싶음'}
        ];
    }else if(important == '우정'){
        Dict = [
            {chinese: '寤寐不忘', pronunciation: '오매불망', meaning: '자나깨나 잊지 못함'},
            {chinese: '寤寐思服', pronunciation: '오매사복', meaning: '자나깨나 생각하는 것'},
            {chinese: '戀戀不忘', pronunciation: '연연불망', meaning: '그리워서 잊지 못함'},
            {chinese: '意中之人', pronunciation: '의중지인', meaning: '마음속에 품고 그리워하는 사람'},
            {chinese: '戀慕之情', pronunciation: '연모지정', meaning: '사랑하여 그리워하는 정'},
            {chinese: '三秋之思', pronunciation: '삼추지사', meaning: '몹시 사모하여 기다리는 마음'},
            {chinese: '念念不忘', pronunciation: '염념불망', meaning: '자꾸 생각나서 잊지 못함'},
            {chinese: '天生緣分', pronunciation: '천생연분', meaning: '하늘에서 정해 준 연분'},
            {chinese: '落花流水', pronunciation: '낙화유수', meaning: '남녀 간 서로 그리워하는 애틋한 정'},
            {chinese: '擲果滿車', pronunciation: '척과만거', meaning: '여성이 남성에게 사랑을 고백함'},
            {chinese: '你可昭綏', pronunciation: '니가조타', meaning: '좋아하는 마음을 고백함'},
            {chinese: '昭我偕耀', pronunciation: '조아해요', meaning: '좋아하는 마음을 고백함'},
            {chinese: '氣麗云你', pronunciation: '기여운너', meaning: '네가 뭐만 해도 귀여워 보임'},
            {chinese: '娜圖昭湛', pronunciation: '나도조음', meaning: '아름다움이 밝게 빛나는 네가 좋음'},
            {chinese: '友鄰因緣', pronunciation: '우린인연', meaning: '서로의 관계를 확인하는 말'},
            {chinese: '思浪海照', pronunciation: '사랑해조', meaning: '사랑을 받고 싶어하는 마음'},
            {chinese: '所重憪恁', pronunciation: '소중한님', meaning: '언제나 당신만을 생각함'},
            {chinese: '寶考時捕', pronunciation: '보고시포', meaning: '몹시 그리워하는 마음'},
            {chinese: '乃据解剌', pronunciation: '내거해라', meaning: '마음에 드는 이에게 사랑을 고백함'},
            {chinese: '電話曷來', pronunciation: '전화할래', meaning: '상대 목소리를 너무나도 듣고 싶음'}
        ];
    }
    const index = Math.floor(Math.random()*Dict.length);
    const random = Dict[index];
    return random;

};

export const dateFormat = (date) =>{ //날짜 포맷 변경
    const [month, day] = date.split(' ');
    const year = new Date().getFullYear();
    const monthMap = {
        'January': '01',
        'February': '02',
        'March': '03',
        'April': '04',
        'May': '05',
        'June': '06',
        'July': '07',
        'August': '08',
        'September': '09',
        'October': '10',
        'November': '11',
        'December': '12',
    };
    const formattedDate = `${year}-${monthMap[month]}-${day}`;
    return formattedDate;
}
