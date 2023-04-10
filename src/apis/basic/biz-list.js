import request from '@/request';

export const getBizTypeTree = ()=>{
    return request({
        url:"/basic/getBizTypeTree",
        method:"get",
    });
}