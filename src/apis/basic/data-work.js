import request from '@/request';

export const startCalcSummary = (data)=>{
    return request({
        url:'/work/generateSummary?month='+data.dataSummaryMonth+'&target='+data.dataSummaryTarget,
        method:'get'
    });
}

export const getDataSummaryTarget = () => {
    return request({
        url:'/work/summaryTarget',
        method:'get'
    })
}