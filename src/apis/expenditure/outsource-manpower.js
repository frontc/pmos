import request from '@/request';

export const getSuppliers = ()=>{
    return request({
        url:"/manhour/external/getSuppliers",
        method:"get",
    });
}

export const listPage = (data)=>{
    return request({
        url:"/manhour/getExternals",
        method:"post",
        data
    });
}

export const upload =(month,file)=>{
    return request({
        url:"/manhour/external/upload/"+month,
        method:"post",
        headers: {
            'Content-Type':'multipart/form-data'
        },
        data:file
    })
}

export const download = (month)=>{
    return request({
        url:"/manhour/external/download/"+month,
        method:"post",
        responseType:"blob"
    })
}