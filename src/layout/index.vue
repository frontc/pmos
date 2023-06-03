<template>
    <div class="page-container">
        <header><page-header /></header>
        <main>
            <div v-if="showLeft" class="left"><page-sidebar /></div>
            <div class="right">
                <router-view></router-view>
            </div>
        </main>
    </div>
</template>
<script setup>
import PageHeader from './components/PageHeader.vue';
import PageSidebar from './components/PageSiderbar.vue';
import { getProjectTypes,getDepartments,getMonths,getProjectStatus,getVersion } from '@/apis/basic/base';

const route = useRoute();
const store = useStore();
const showLeft = computed(() => {
    const rounteName = route.name;
    return !['Login', 'NotFound'].includes(rounteName) && !/^Personal/.test(rounteName);
});

//初始化项目类型
getProjectTypes().then(res=>{
    store.commit('setProjectTypes',res.data);
})
//初始化部门列表
getDepartments().then(res=>{
    store.commit('setDepartments',res.data);
})
//初始化月份列表
getMonths().then(res=>{
    store.commit('setMonths',res.data);
})
//初始化项目状态
getProjectStatus().then(res=>{
    store.commit('setProjectStatus',res.data);
})
//获取版本信息
getVersion().then(res=>{
    store.commit('setVersion',res.data);
})

</script>
<style lang="scss">
.page-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    >header {
        height: 54px;
        background: #000;
        color: #fff;
    }

    >main {
        display: flex;
        flex: 1;
        overflow: auto;

        >.left {
            height: 100%;
            background: #000;
            color: #fff;
        }

        >.right {
            flex: 1;
            overflow: hidden;
            background-color: #f5f7f9;

            >.main-body {
                padding: 16px 16px 30px;
                overflow: auto;
                height: 100%;
                box-sizing: border-box;
            }
        }
    }
}
</style>