<template>
    <h1>这是登录页面</h1>
    <el-button @click="testAxios">测试</el-button>
</template>
<script setup>
import axios from 'axios'
function testAxios() {
    axios.get('https://api.lefer.cn/img/tomu_mainprocess.png')
        .then(res => { alert(res.data) })
        .catch(error => { console.log(error) });
}
</script>