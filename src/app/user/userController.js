import axios from "axios";


export const handleKakaoCallback = async(req,res)=>{ 
    const code = req.query.code;
    try{
        const accessTokenresponse = await axios.post('https://kauth.kakao.com/oauth/token',{ //accessToken 받기
            grant_type: 'authorization_code',
            client: '19072abcbc9713f319c65dd8ae5de354',
            redirect_uri: '/auth/kakao/callback',
            code: code, 
        });
        const accessToken = accessTokenresponse.data.accessToken;
        const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me',{ //accessToken으로 사용자 정보 받아오기
            headers:{
                Authorization:`Bearer${accessToken}`,
            },
        });
        const userInfo = userInfoResponse.data;
        res.json(userInfo);
    }catch{
        console.error('Failed to process Kakao callback:', error.response.data);
        res.status(500).json({ error: 'Failed to process Kakao callback' });
    }
};