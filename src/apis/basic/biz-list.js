import request from '@/request';

export const getBizTypeTree = ()=>{
    return request({
        url:"/basic/getBizTypeTree",
        method:"get",
    });
}

export const getBizType1 = ()=>{
    return request({
        url:"/basic/getBizType1",
        method:"get",
    });
}

export const getBizTypeSons = (data)=>{
    return request({
        url:"/basic/getBizTypeSons?parentCode="+data,
        method:"get",
    });
}