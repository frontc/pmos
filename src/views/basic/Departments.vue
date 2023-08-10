<template>
    <div class="main-body">
        <!--工具栏-->
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.deptName" :placeholder="t('form.deptName')" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-tooltip effect="dark" :content="t('action.search')" placement="bottom">
                        <el-button icon="search" type="primary" @click="findPage" />
                    </el-tooltip>
                </el-form-item>
                <el-form-item>
                    <el-tooltip effect="dark" :content="t('action.add')" placement="bottom">
                        <el-button icon="plus" type="primary" @click="handleAdd" />
                    </el-tooltip>
                </el-form-item>
                <el-form-item class="export">
                    <el-tooltip effect="dark" :content="t('action.export')" placement="bottom">
                        <el-button icon="download" type="primary" @click="exportExcel" :loading="downloading" circle />
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </div>
        <!--表格区-->
        <cm-table id="data-table" ref="tableRef" :get-page="listPage" :filters="filters" :columns="columns"
            :showOperation="true" :showBatchDelete="false" @handleEdit="handleEdit" @handleDelete="handleDelete"
            :max-height="tableHeight">
        </cm-table>
    </div>
    <!--新增/编辑弹框-->
    <el-dialog :title="isEdit ? t('action.edit') : t('action.add')" v-model="dialogVisible" draggable width="50%"
        :close-on-click-modal="false" @close="closeDialog" center>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" label-position="right" :inline="true">
            <el-form-item :label="t('thead.deptName')" prop="deptName">
                <el-input v-model="form.deptName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="formLoading" @click="handleSubmit(formRef)">{{ t("action.submit")}}</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script setup>
import { listPage,submitPage, remove, download } from '@/apis/basic/departments';
const store = useStore();
const { t } = useI18n();

//表格定义
const tableRef = ref();
const columns = computed(() => [
    { prop: "uid", label: t("thead.uid"), minWidth: 15 },
    { prop: "deptName", label: t("thead.deptName"), minWidth: 40 },
]);

const findPage = () => {
    tableRef.value.reload();
}

//过滤器相关变量
const filters = reactive({
    deptName: ''
});

//弹框页面相关
const isEdit = ref(false);
const dialogVisible = ref(false);
const formRef = ref();
const form = reactive({
    uid:'',
    deptName: '',
});

const rules = computed(() => {
    return {
        deptName: [{ required: true, message: t('form.deptNameRequired'), trigger: ['blur'] }],
    }
});


function handleAdd() {
    dialogVisible.value = true;
    isEdit.value = false;
}

function handleEdit(row) {
    dialogVisible.value = true;
    isEdit.value = true;
    Object.assign(form, row);
}

function handleEmpty() {
    let initForm = {
        uid: '',
        deptName: '',
    };
    Object.assign(form, initForm);
}

function closeDialog() {
    dialogVisible.value = false;
}

const formLoading = ref(false);


function handleSubmit(formRef) {
    formRef.validate((valid) => {
        if (valid) {
            formLoading.value = true;
            if (!isEdit) { form.uid = ''; }
            submitPage(form).then(() => {
                findPage();
                closeDialog();
                handleEmpty();
                ElMessage({ message: t('tips.success'), type: "success" });
            }).catch().finally(formLoading.value = false);
        } else {
            ElMessage({ message: t('tips.validateFailed'), type: "error" });
            return false;
        }
    });
}

function handleDelete(ids) {
    remove(ids);
    findPage();
}

const downloading = ref(false);
const exportExcel = () => {
    downloading.value = true;
    download().then((res) => {
        const link = document.createElement('a');
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "部门列表.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch().finally(() => {
        downloading.value = false;
    });
}


const tableHeight = ref();
onMounted(() => {
    tableHeight.value = window.innerHeight - tableRef.value.$el.offsetTop - 85;
    window.onresize = () => {
        tableHeight.value = window.innerHeight - tableRef.value.$el.offsetTop - 85;
    }
})
</script>
<style lang="scss">
.export {
    float: right;
    padding-right: 0;
}
</style>