import Mock from "mockjs";
import config from "@/request/config";
import * as login from "./modules/login";
const { baseURL, timeout } = config;
Mock.setup({timeout});

const openMock=true;

mock(login,openMock);

function mock(mod,isOpen = true){
    if(isOpen){
        for(var key in mod){
            ((res)=>{
                if(res.isOpen!==false){
                    let url= baseURL;
                    if(!url.endsWith("/")){
                        url = url+"/";
                    }
                    url=url+res.url;
                    Mock.mock(new RegExp(url),res.method,(opts)=>{
                        opts.data=opts.body?JSON.parse(opts.body):null;
                        const resData = Mock.mock(typeof res.response === 'function'?res.response(opts):res.response);
                        console.log('%cmock拦截，请求:','color:blue',opts);
                        console.log('%cmock拦截，响应:','color:blue',resData);
                    })
                }
            })(mod[key]()||{});
        }
    }
}