import request from "@/request";

export const login = (data) => {
    return request({
        url: "user/doLogin",
        method: "post",
        data
    });
}