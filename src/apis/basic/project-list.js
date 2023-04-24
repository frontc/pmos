import request from '@/request';

export const listPage = (data)=>{
    return request({
        url:"/basic/getProjectMappingInfos",
        method:"post",
        data
    });
}

export const submitPage = (data)=>{
    return request({
        url:"/basic/updateProjectMappingInfo",
        method:"post",
        data
    });
}

export const remove = (data)=>{
    return request({
        url:"/basic/removeProjectMappingInfo",
        method:"post",
        data
    });
}

export const download = ()=>{
    return request({
        url:"/basic/projectMappingInfo/download/",
        method:"post",
        responseType:"blob",
        // data:"month",
    })
}