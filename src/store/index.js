import { createStore } from 'vuex'
import persistedState from 'vuex-persistedstate'

export default createStore({
    state: {
        token: '',
        username:'',
        isLogin:false,
        projectTypes:[],
        departments:[],
        months:[],
        projectStatus:[],
        version:'',
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
        },
        setProjectTypes(state,projectTypes){
            state.projectTypes=projectTypes;
        },
        setDepartments(state,departments){
            state.departments=departments;
        },
        setMonths(state,months){
            state.months=months;
        },
        setProjectStatus(state,projectStatus){
            state.projectStatus=projectStatus;
        },
        setVersion(state,version){
            state.version=version;
        },
    },
    plugins:[persistedState()],
})