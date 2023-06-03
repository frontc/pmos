<template>
    <div class="page-sidebar">
        <div class="collape-bar">
            <el-icon class="cursor" @click="isCollapse = !isCollapse">
                <expand v-if="isCollapse"></expand>
                <fold v-else></fold>
            </el-icon>
        </div>
        <el-menu :default-active="defaultActive" router class="sidemenu" :collapse="isCollapse">
            <el-sub-menu v-for="(item, i) in treeData" :key="i" :index="item.path">
                <template #title>
                    <el-icon v-if="item.icon">
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ t("menu." + item.name) }}</span>
                </template>
                <template v-for="(child, ci) in item.children" :key="ci">
                    <el-menu-item :index="child.path">
                        <el-icon v-if="child.icon">
                            <component :is="child.icon"></component>
                        </el-icon>
                        <span>{{ t("menu." + child.name) }}</span>
                    </el-menu-item>
                </template>
            </el-sub-menu>
        </el-menu>
        <div class="fixed-bottom">
            <el-tag type="info" effect="plain" >v{{ version }}</el-tag>
        </div>
    </div>
</template>
<script setup>
import { menuTreeData } from "@/data";
const { t } = useI18n();
const route = useRoute();
const store = useStore();
const treeData = menuTreeData;
const defaultActive = computed(() => route.path || treeData.value[0].path);
const isCollapse = ref(false);
const version =  computed(() => { return store.state.version });

</script>
<style lang="scss">
$side-width: 200px;

.page-sidebar {

    .sidemenu.el-menu,
    .sidemenu.el-submenu>.el-menu {
        --el-menu-text-color: #ccc;
        --el-menu-hover-bg-color: #060251;
        --el-menu-border-color: transparent;
        --el-menu-bg-color: #000;

        .el-menu-item {
            &.is-active {
                background-color: var(--el-menu-hover-bg-color);
            }
        }

        .sidemenu.el-menu:not(.el-menu--collapse) {
            width: $side-width;
        }
    }

    .collape-bar {
        color: #fff;
        font-size: 16px;
        line-height: 36px;
        text-align: center;

        .c-icon {
            cursor: pointer;
        }
    }
}

.fixed-bottom {
    position: fixed;
    bottom: 0;
    transform: translateX(70%);
}
</style>