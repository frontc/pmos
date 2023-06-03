import request from '@/request';

export const getMonths = () => {
    return request({
        url: "/basic/getMonths",
        method: "get",
    });
}

export const getDepartments = () => {
    return request({
        url: '/basic/getDepartments',
        method: 'get',
    });
}

export const getProjectTypes = () => {
    return request({
        url:'/projectType',
        method:'get'
    })
}

export const getProjectStatus = () => {
    return request({
        url:'/projectStatus',
        method:'get'
    })
}

export const getVersion = () => {
    return request({
        url:'/basic/getVersion',
        method:'get'
    })
}