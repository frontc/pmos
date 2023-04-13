import request from '@/request';

export const getDepartments = ()=>{
    return request({
        url:'/basic/getDepartments',
        method:'get',
    });
}