<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<template>
  <el-config-provider :locale="zhCn"><router-view></router-view></el-config-provider>
</template>

<style >
html,
body {
  height: 100%;
}
#app{
  height: 100%;
  overflow: hidden;
}
</style>
