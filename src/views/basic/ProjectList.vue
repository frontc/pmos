<template>
    <div class="main-body">
        <!--工具栏-->
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.projectName" :placeholder="t('form.projectName')" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-cascader :options="bizTypeTree" :props="cascaderProps" :collapse-tags=true
                        :collapse-tags-tooltip=true v-model="filters.bizTypeSelections" clearable
                        :placeholder="t('form.bizType')" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="filters.costDept" :placeholder="t('form.costDept')" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="search" type="primary" @click="findPage">{{ t('action.search') }}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button icon="plus" type="primary" @click="handleAdd">{{ t('action.add') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <cm-table ref="tableRef" :get-page="listPage" :filters="filters" :columns="columns" :showOperation="true"
            :showBatchDelete="false" @handleEdit="handleEdit">
        </cm-table>
    </div>
    <el-dialog :title="isEdit ? t('action.edit') : t('action.add')" v-model="dialogVisible" draggable width="40%"
        :close-on-click-modal="false" @close="closeDialog">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="right">
            <el-form-item :label="t('thead.projectCode')" prop="projectCode">
                <el-input v-model="form.projectCode"></el-input>
            </el-form-item>
            <el-form-item :label="t('thead.projectName')" prop="projectName">
                <el-input v-model="form.projectName"></el-input>
            </el-form-item>
            <el-form-item :label="t('thead.bizType1')" prop="bizType1">
                <el-select v-model="form.bizType1" clearable :placeholder="t('form.select')" @change="refreshBizType2">
                    <el-option v-for="item in bizType1Options" :key="item.value" :label="item.label" :value="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item :label="t('thead.bizType2')" prop="bizType2">
                <el-select v-model="form.bizType2" clearable :placeholder="t('form.select')">
                    <el-option v-for="item in bizType2Options" :key="item.value" :label="item.label" :value="item.label" />
                </el-select>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script setup>
import { listPage } from '@/apis/basic/project-list';
import { getBizTypeTree,getBizType1,getBizTypeSons } from '@/apis/basic/biz-list';

const { t } = useI18n();
const tableRef = ref();
const filters = reactive({
    projectName: '',
    bizTypeSelections: [],
    costDept: '',
});
const cascaderProps = {
    multiple: true,
    checkStrictly: false,
    emitPath: false,
}
const bizTypeTree = ref([]);
getBizTypeTree().then((res) => {
    bizTypeTree.value = res.data;
});

const columns = computed(() => [
    { prop: "uid", label: t("thead.uid"), minWidth: 15 },
    { prop: "projectCode", label: t("thead.projectCode"), minWidth: 40 },
    { prop: "projectName", label: t("thead.projectName"), minWidth: 120 },
    { prop: "bizType1", label: t("thead.bizType1"), minWidth: 30 },
    { prop: "bizType2", label: t("thead.bizType2"), minWidth: 60 },
    { prop: "costDept", label: t("thead.costDept"), minWidth: 50 },
]);

const findPage = () => {
    tableRef.value.reload();
}

const isEdit = ref(false);
const dialogVisible = ref(false);
const formRef = ref();
const form = reactive({
    projectCode: '',
    projectName: '',
    bizType1:'',
    bizType2:'',
});
const bizType1Options = ref([]);
getBizType1().then((res)=>{
    bizType1Options.value=res.data;
});
const bizType2Options=ref([]);
function refreshBizType2(){
    form.bizType2='';
    if(form.bizType1===''||form.bizType1===null){
        bizType2Options.value=[];
    }else{
        const bizTypeObj = bizType1Options.value.find(item=>item.label===form.bizType1);
        getBizTypeSons(bizTypeObj.value).then((res)=>{
            bizType2Options.value=res.data;
        })
    }
}

function handleAdd() {
    dialogVisible.value = true;
    isEdit.value = false;
}

function handleEdit(row) {
    console.log(row);
}

function closeDialog() {
    console.log(form);
}

</script>
<style lang="scss">
.el-cascader__tags {
    display: inline-flex;
    flex-wrap: nowrap;
    margin-right: 60px;
}
</style>