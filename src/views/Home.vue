<template>
    这里是HOME页面
    <hr />
    <div class="wrap">
        <p>
            count:{{ count }}
        </p>
    </div>
</template>
<script setup>
const store = useStore();
const count = computed(() => store.state.count)
</script>
<style lang="scss">
.wrap {
    background: yellow;

    p {
        color: blue;
        font-size: 24px;
    }
}
</style>