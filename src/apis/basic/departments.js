import request from '@/request';

export const listPage = (data)=>{
    return request({
        url:"/basic/getDepartments",
        method:"post",
        data,
    });
}

export const submitPage = (data)=>{
    return request({
        url:"/basic/updateDepartment",
        method:"post",
        data
    });
}

export const remove = (data)=>{
    return request({
        url:"/basic/removeDepartment",
        method:"post",
        data
    });

    
}


export const download = ()=>{
    return request({
        url:"/basic/departments/download/",
        method:"post",
        responseType:"blob",
    })
}