import axios from "axios";
import config from './config';
import router from "@/route";
import { ElMessage } from "element-plus";

export default function request(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({ ...config });
        // 定义request请求拦截器
        instance.interceptors.request.use(
            (config) => {
                // 从缓存中取出token
                let token = localStorage.getItem("pm_token");
                if (token) {
                    config.headers.token = token;
                } else {
                    router.push("/login");
                }
                return config;
            },
            (error) => {
                //请求发生错误时
                console.log("request:", error);
                //判断请求超时
                if (error.code === "ECONNABORTED" && error.message.indexOf("timeout") !== -1) {
                    ElMessage({ message: '请求超时', type: 'error', showClose: true });
                }
                return Promise.reject(error);
            }
        );
        //定义response拦截器，统一处理response错误
        instance.interceptors.response.use(
            (response) => { return response.data },
            (err) => {
                if (err && err.response) {
                    switch (err.response.status) {
                        case 400:
                            err.message = "请求错误";
                            break;
                        case 401:
                            err.message = "未授权，请登录";
                            break;
                        case 403:
                            err.message = "拒绝访问";
                            break;
                        case 404:
                            err.message = "请求的地址不存在:${err.response.config.url}";
                            break;
                        case 408:
                            err.message = "请求超时";
                            break;
                        case 500:
                            err.message = "服务器内部错误";
                            break;
                        case 501:
                            err.message = "服务未实现";
                            break;
                        case 502:
                            err.message = "网关错误";
                            break;
                        case 503:
                            err.message = "服务不可用";
                            break;
                        case 504:
                            err.message = "网关超时";
                            break;
                        case 505:
                            err.message = "HTTP版本不受支持";
                            break;
                        default:
                    }
                }
                console.error(err);
                if (err.message) {
                    ElMessage({ message: err.message, type: 'error', showClose: true });
                }
                return Promise.reject(err);
            }
        );
        //请求处理
        instance(options).then(
            (res) => {
                /**
                 * response 统一格式
                 * {
                 *  code:200,
                 *  msg:'消息[string]',
                 *  data:'返回的数据[Any]'
                 * }
                 * code说明：
                 * 200成功
                 * -1正常的失败
                 * -2登录失效，需要跳回登录页面
                 */
                if (res.code === 200) {
                    resolve(res);
                } else {
                    if (res.code === -2) {
                        router.push("/login");
                    }
                    ElMessage({ message: res.msg || "操作失败", type: "error", showClose: true });
                    reject(res);
                }
            }
        ).catch(
            (error) => {
                reject(error);
            }
        );
    })
}