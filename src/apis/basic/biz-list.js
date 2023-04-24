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

export const listPage = (data)=>{
    return request({
        url:"/basic/getBizTypes",
        method:"post",
        data
    });
}

export const submitPage = (data)=>{
    return request({
        url:"/basic/updateBizType",
        method:"post",
        data
    });
}

export const remove = (data)=>{
    return request({
        url:"/basic/removeBizType",
        method:"post",
        data
    });
}

export const checkBizTypeCode = (data)=>{
    return request({
        url:"/basic/checkBizTypeCode?bizTypeCode="+data,
        method:"get",
    });
}

export const download = ()=>{
    return request({
        url:"/basic/bizType/download/",
        method:"post",
        responseType:"blob",
        // data:"month",
    })
}