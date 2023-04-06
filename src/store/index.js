import { createStore } from 'vuex'

export default createStore({
    state: {
        token: '',
        username:'',
    },
    mutations: {
        setToken(state,token){
            localStorage.setItem('token',token);
            state.token=token;
        },
        setUsername(state,username){
            localStorage.setItem('username',username);
            state.username=username;
        }
    },
})