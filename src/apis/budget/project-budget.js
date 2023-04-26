import request from '@/request';

export const listPage = (data)=>{
    return request({
        url:"/projectBudget/page",
        method:"post",
        data
    });
}

export const submitPage = (data)=>{
    return request({
        url:"/projectBudget/update",
        method:"post",
        data
    });
}

