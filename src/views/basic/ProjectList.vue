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
        <!--表格区-->
        <cm-table ref="tableRef" :get-page="listPage" :filters="filters" :columns="columns" :showOperation="true"
            :showBatchDelete="false" @handleEdit="handleEdit" @handleDelete="handleDelete">
        </cm-table>
    </div>
    <!--新增/编辑弹框-->
    <el-dialog :title="isEdit ? t('action.edit') : t('action.add')" v-model="dialogVisible" draggable width="40%"
        :close-on-click-modal="false" @close="closeDialog" center>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="right">
            <el-form-item :label="t('thead.projectCode')" prop="projectCode">
                <el-input v-model="form.projectCode"></el-input>
            </el-form-item>
            <el-form-item :label="t('thead.projectName')" prop="projectName">
                <el-input v-model="form.projectName"></el-input>
            </el-form-item>
            <el-form-item :label="t('thead.bizType1')" prop="bizType1">
                <el-select v-model="form.bizType1" clearable :placeholder="t('form.select')" @change="refreshBizType2('')">
                    <el-option v-for="item in bizType1Options" :key="item.value" :label="item.label" :value="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item :label="t('thead.bizType2')" prop="bizType2">
                <el-select v-model="form.bizType2" clearable :placeholder="t('form.select')">
                    <el-option v-for="item in bizType2Options" :key="item.value" :label="item.label" :value="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item :label="t('thead.costDept')" prop="costDept">
                <el-select v-model="form.costDept" clearable :placeholder="t('form.select')">
                    <el-option v-for="item in deptOptions" :key="item.uid" :label="item.deptName" :value="item.deptName" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleEmpty" :disabled="isEdit">{{ t("action.empty") }}</el-button>
            <el-button type="primary" :loading="formLoading" @click="handleSubmit">{{ t("action.submit") }}</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { listPage, submitPage,remove } from '@/apis/basic/project-list';
import { getBizTypeTree, getBizType1, getBizTypeSons } from '@/apis/basic/biz-list';
import { getDepartments } from '@/apis/basic/departments';


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
    uid: '',
    projectCode: '',
    projectName: '',
    bizType1: '',
    bizType2: '',
    costDept: '',
});
const rules = computed(() => {
    return {
        projectName: [
            { required: true, message: t('form.projectNameRequired'), trigger: ['blur', 'change'] },
            { min: 2, max: 60, message: t('form.projectNameError'), trigger: ['blur', 'change'] }
        ],
        bizType1: [
            { required: true, message: t('form.bizType1Required'), trigger: ['blur', 'change'] },
        ],
        bizType2: [
            { required: true, message: t('form.bizType2Required'), trigger: ['blur', 'change'] },
        ],
        costDept: [
            { required: true, message: t('form.costDeptRequired'), trigger: ['blur', 'change'] },
        ],
    }
});
const bizType1Options = ref([]);
getBizType1().then((res) => {
    bizType1Options.value = res.data;
});
const bizType2Options = ref([]);
function refreshBizType2(value) {
    form.bizType2 = value;
    if (form.bizType1 === '' || form.bizType1 === null) {
        bizType2Options.value = [];
    } else {
        const bizTypeObj = bizType1Options.value.find(item => item.label === form.bizType1);
        getBizTypeSons(bizTypeObj.value).then((res) => {
            bizType2Options.value = res.data;
        })
    }
}
const deptOptions = ref([]);
getDepartments().then((res) => {
    deptOptions.value = res.data;
});

function handleAdd() {
    dialogVisible.value = true;
    isEdit.value = false;
}

function handleEdit(row) {
    dialogVisible.value = true;
    isEdit.value = true;
    Object.assign(form, row);
    refreshBizType2(row.bizType2);
}

function handleEmpty() {
    let initForm = {
        uid: '',
        projectCode: '',
        projectName: '',
        bizType1: '',
        bizType2: '',
        costDept: '',
    };
    Object.assign(form, initForm);
}

function closeDialog() {
    dialogVisible.value = false;
}

const formLoading = ref(false);
function handleSubmit() {
    formLoading.value = true;
    if (!isEdit) { form.uid = ''; }
    submitPage(form).then(() => {
        findPage();
        closeDialog();
        handleEmpty();
        ElMessage({ message: t('tips.success'), type: "success" });
    }).catch().finally(formLoading.value = false);
}

function handleDelete(ids){
    remove(ids);
    findPage();
}

</script>
<style lang="scss">
.el-cascader__tags {
    display: inline-flex;
    flex-wrap: nowrap;
    margin-right: 60px;
}
</style>