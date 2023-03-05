<template>
    这里是About页面
    <hr />
    <button @click="increase">增加</button>
    <hr />
    count: {{ count }}
</template>

<script setup>
const store = useStore();
let count = 3;
function increase() {
    count++;
    store.commit('increase', count)
}
</script>