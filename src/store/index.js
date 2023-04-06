import { createStore } from 'vuex'
import persistedState from 'vuex-persistedstate'

export default createStore({
    state: {
        token: '',
        username:'',
        isLogin:false,
    },
    mutations: {
        setToken(state,token){
            localStorage.setItem('token',token);
            state.token=token;
            state.isLogin=true;
        },
        setUsername(state,username){
            localStorage.setItem('username',username);
            state.username=username;
        },
        logout(state){
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            state.token='';
            state.username='';
            state.isLogin=false;
        }
    },
    plugins:[persistedState()],
})