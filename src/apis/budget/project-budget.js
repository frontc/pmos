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

export const remove = (data)=>{
    return request({
        url:"/projectBudget/delete",
        method:"post",
        data
    });
}

export const download = ()=>{
    return request({
        url:"/projectBudget/download",
        method:"post",
        responseType:"blob",
    })
}

export const getProjects = (projectStatus)=>{
    return request({
        url:'projectBudget/projects?projectStatus='+projectStatus,
        method:'get'
    });
}
