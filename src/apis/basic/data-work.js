import request from '@/request';

export const generateDataSummay = (data)=>{
    return request({
        url:'/work/generateDataSummary?month='+data.dataSummaryMonth+'&target='+data.dataSummaryTarget,
        method:'get'
    });
}

export const generateProjectSummay = (data)=>{
    return request({
        url:'/work/generateProjectSummary',
        method:'post',
        data
    });
}

export const getDataSummaryTarget = () => {
    return request({
        url:'/work/summaryTarget',
        method:'get'
    })
}