<template>
    <div class="main-body">
        <!--工具栏-->
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.projectName" :placeholder="t('form.projectName')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-cascader :options="bizTypeTree" :props="cascaderProps" :collapse-tags=true
                    :collapse-tags-tooltip=true v-model="filters.bizTypeSelections"
                    clearable :placeholder="t('form.bizType')" />
                </el-form-item>
                <el-form-item>
                    <el-button icon="search" type="primary" @click="findPage">{{ t('action.search') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <cm-table ref="tableRef" :get-page="listPage" :filters="filters" :columns="columns" :showOperation="false"
            :showBatchDelete="false">
        </cm-table>
    </div>
</template>
<script setup>
import { listPage } from '@/apis/basic/project-list';
import { getBizTypeTree } from '@/apis/basic/biz-list';

const { t } = useI18n();
const tableRef = ref();
const filters = reactive({
    projectName: '',
    bizTypeSelections:[],
});
const cascaderProps = {
    multiple: true,
    checkStrictly: false,
    emitPath:false,
}
const bizTypeTree = ref([]);
getBizTypeTree().then((res) => {
    bizTypeTree.value = res.data;
});

console.log(filters);

const columns = computed(() => [
    { prop: "uid", label: t("thead.uid"), minWidth: 15 },
    { prop: "projectCode", label: t("thead.projectCode"), minWidth: 30 },
    { prop: "projectName", label: t("thead.projectName"), minWidth: 120 },
    { prop: "bizType1", label: t("thead.bizType1"), minWidth: 30 },
    { prop: "bizType2", label: t("thead.bizType2"), minWidth: 60 },
    { prop: "costDept", label: t("thead.costDept"), minWidth: 60 },
]);

const findPage = () => {
    tableRef.value.reload();
}
</script>
<style lang="scss">
.el-cascader__tags{
    display: inline-flex;
    flex-wrap: nowrap;
    margin-right: 60px;
}
</style>