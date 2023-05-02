import request from '@/request';

export const listPage=(data)=>{
    return request({
        url:"/analysis/projectBudgetProgress",
        method:"post",
        data
    });
}

export const download = ()=>{
    return request({
        url:"/analysis/projectBudgetProgress/download",
        method:"post",
        responseType:"blob",
    })
}