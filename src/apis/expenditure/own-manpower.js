import request from '@/request';
import axios from "axios";

export const listPage = (data)=>{
    return request({
        url:"/manhour/getInternals",
        method:"post",
        data
    });
}

export const upload =(month,file)=>{
    return request({
        url:"/manhour/upload/"+month,
        method:"post",
        headers: {
            'Content-Type':'multipart/form-data'
        },
        data:file
    })
}
