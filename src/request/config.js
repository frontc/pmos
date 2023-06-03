export default {
    method: 'get',
    baseURL: 'http://127.0.0.1:8080',
    // baseURL: 'http://10.89.64.20:8080',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    timeout: 10000,
    withCredentials: true,
    responseType: 'json'
}