import { createRouter, createWebHashHistory } from "vue-router";
import Layout from '@/layout/index.vue';
import PageFrame from "@/layout/components/PageFrame.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Layout,
        children: [
            {
                path: "login",
                name: "Login",
                component: () => import('@/views/login/index.vue'),
            },
            {
                path: "404",
                name: "NotFound",
                component: () => import('@/views/404.vue'),
            },
            {
                path: "personal",
                name: "Personal",
                meta: { requireAuth: true },
                component: () => import('@/views/personal/index.vue'),
                children: [{
                    path: "message",
                    name: "PersonalMessage",
                    component: () => import('@/views/personal/message.vue')
                }]
            },
            {
                path: "expenditure",
                name: "Expenditure",
                meta: { requireAuth: true },
                redirect:'/expenditure/own-manpower',
                component:PageFrame,
                children:[
                    {
                        path:"own-manpower",
                        name:"OwnManpower",
                        meta: { requireAuth: true },
                        component: () => import('@/views/expenditure/OwnManpower.vue')
                    },
                    {
                        path:"outsourced-manpower",
                        name:"OutsourcedManpower",
                        meta: { requireAuth: true },
                        component: () => import('@/views/expenditure/OutsourcedManpower.vue')
                    },
                ]
            },
            {
                path: "budget",
                name: "Budget",
                meta: { requireAuth: true },
                redirect:'/budget/dept-budget',
                component:PageFrame,
                children:[
                    {
                        path:"dept-budget",
                        name:"DeptBudget",
                        meta: { requireAuth: true },
                        component: () => import('@/views/budget/DeptBudget.vue')
                    },
                    {
                        path:"project-budget",
                        name:"ProjectBudget",
                        meta: { requireAuth: true },
                        component: () => import('@/views/budget/ProjectBudget.vue')
                    },
                ]
            },
            {
                path: "basic",
                name: "Basic",
                meta: { requireAuth: true },
                redirect:'/basic/project-list',
                component:PageFrame,
                children:[
                    {
                        path:"project-list",
                        name:"ProjectList",
                        meta: { requireAuth: true },
                        component: () => import('@/views/basic/ProjectList.vue')
                    },
                    {
                        path:"bussiness-list",
                        name:"BussinessList",
                        meta: { requireAuth: true },
                        component: () => import('@/views/basic/BussinessList.vue')
                    },
                ]
            },
        ],
    },
    {
        path: "/:pathMatch(.*)*",
        name: "404",
        redirect: '/404',
        component: () => import('@/views/404.vue'),
    }
]
const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

//如果是需要认证的页面，没有token，就跳转到登陆页面
router.beforeEach((to) => {
    const token = localStorage.getItem("token");
    if (to.meta.requireAuth && !token) {
        return { name: "Login" }
    }
    return true;
});

export default router