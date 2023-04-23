import request from '@/request';

export const getMonths = ()=>{
    return request({
        url:"/basic/getMonths",
        method:"get",
    });
}