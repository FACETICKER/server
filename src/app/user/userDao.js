import User from "../../../models/user.js";

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