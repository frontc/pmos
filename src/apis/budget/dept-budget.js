import request from '@/request';

export const listPageDetail = (data)=>{
    return request({
        url:"/deptBudget/getDeptBudget/detail",
        method:"post",
        data
    });
}

export const download = (data)=>{
    return request({
        url:"/deptBudget/download/"+data.budgetYear+"/"+data.budgetDept,
        method:"post",
        responseType:"blob",
    })
}