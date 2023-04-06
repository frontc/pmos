import request from "@/request";

export const login = (data) => {
    return request({
        url: "user/doLogin",
        method: "post",
        data
    });
};

export const getLoginState = () =>{
    return request({
        url:"user/isLogin",
        method:"get"
    });
};

export const logout = () =>{
    return request({
        url:"user/logout",
        method:"get"
    });
};