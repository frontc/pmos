import request from '@/request';

export const listPageDetail = (data)=>{
    return request({
        url:"/deptBudget/getDeptBudget/detail",
        method:"post",
        data
    });
}

export const listPageDept = (data)=>{
    return request({
        url:"/deptBudget/getDeptBudget/dept",
        method:"post",
        data
    });
}

export const listPageBiz = (data)=>{
    return request({
        url:"/deptBudget/getDeptBudget/biz",
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

export const upload =(data,file)=>{
    return request({
        url:"/deptBudget/upload/"+data.budgetYear+"/"+data.budgetDept,
        method:"post",
        headers: {
            'Content-Type':'multipart/form-data'
        },
        data:file
    })
}

export const getBudgetDept =()=>{
    return request({
        url:"/deptBudget/dept",
        method:"get",
    })
}