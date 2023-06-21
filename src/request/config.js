export default {
    method: 'get',
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    timeout: 10000,
    withCredentials: true,
    responseType: 'json'
}