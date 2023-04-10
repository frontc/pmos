import request from '@/request';

export const listPage = (data)=>{
    return request({
        url:"/basic/getProjectMappingInfos",
        method:"post",
        data
    });
}