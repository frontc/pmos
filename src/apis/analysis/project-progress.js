import request from '@/request';

export const listPage=(data)=>{
    return request({
        url:"/analysis/projectBudgetProgress",
        method:"post",
        data
    });
}