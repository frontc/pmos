import request from '@/request';

export const listPage = (data)=>{
    return request({
        url:"/manhour/getInternals",
        method:"post",
        data
    });
}

export const upload =(month,file)=>{
    return request({
        url:"/manhour/internal/upload/"+month,
        method:"post",
        headers: {
            'Content-Type':'multipart/form-data'
        },
        data:file
    })
}

export const download = (month)=>{
    return request({
        url:"/manhour/internal/download/"+month,
        method:"post",
        responseType:"blob",
        data:month,
    })
}