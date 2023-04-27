<template>
    <div class="main-body">
        <!--工具栏-->
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <!--月份下拉框-->
                <el-form-item>
                    <el-select v-model="filters.month">
                        <el-option v-for="item in monthOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <!--报工部门下拉框-->
                <el-form-item>
                    <el-select v-model="filters.employeeDept" clearable :placeholder="t('form.employeeDept')">
                        <el-option v-for="item in deptOptions" :key="item.uid" :label="item.deptName"
                            :value="item.deptName" />
                    </el-select>
                </el-form-item>
                <!--需求部门下拉框-->
                <el-form-item>
                    <el-select v-model="filters.demandDept" clearable :placeholder="t('form.demandDept')">
                        <el-option v-for="item in deptOptions" :key="item.uid" :label="item.deptName"
                            :value="item.deptName" />
                    </el-select>
                </el-form-item>
                <!--项目名称输入框-->
                <el-form-item>
                    <el-input v-model="filters.projectName" :placeholder="t('form.projectName')" clearable></el-input>
                </el-form-item>
                <!--员工姓名输入框-->
                <el-form-item>
                    <el-input v-model="filters.employeeName" :placeholder="t('form.employeeName')" clearable></el-input>
                </el-form-item>
                <!--查询按钮-->
                <el-form-item>
                    <el-button icon="search" type="primary" @click="findPage" :loading="searchLoading">{{ t('action.search')
                    }}</el-button>
                </el-form-item>
                <!--进入维护页面-->
                <el-form-item class="maintenance">
                    <el-button icon="tools" type="default" @click="showDialog" circle></el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--表格区-->
        <cm-table id="data-table" ref="tableRef" :get-page="listPage" :filters="filters" :columns="columns"
            :showOperation="false" :showBatchDelete="false" :max-height="tableHeight">
        </cm-table>
    </div>
    <!--新增/编辑弹框-->
    <el-dialog :title="t('maintenance')" v-model="dialogVisible" draggable width="40%" :close-on-click-modal="false"
        @close="closeDialog" center>
        <el-card>
            <template #header>
                <div class="card-header">
                    <el-icon size="large">
                        <Download />
                    </el-icon><span class="card-header-title">{{ t('dialog.export') }}</span>
                </div>
            </template>
            <div>
                <span class="margin_10">{{ t('form.month') }}</span>
                <!--月份下拉框-->
                <el-select v-model="downloadMonth">
                    <el-option v-for="item in monthOptions" :key="item" :label="item" :value="item" />
                </el-select>
                <el-button type="primary" @click="doDownload" class="margin_10" slot="default" :loading="downloading">{{
                    t('form.download')
                }}</el-button>
            </div>
        </el-card>
        <el-divider />
        <el-card>
            <template #header>
                <div class="card-header">
                    <el-icon size="large"><Upload /></el-icon>
                    <el-tooltip :content="t('dialog.manhourInternalImportTips')">
                        <span class="card-header-title">{{ t('dialog.import') }}</span>
                    </el-tooltip>            
                </div>
            </template>
            <div>
                <el-row>
                    <el-upload ref="uploadRef" action :http-request="uploadRequest" v-model:file-list="fileList"
                        :auto-upload="false" :limit="1" accept=".xls,.xlsx">
                        <span class="margin_10">{{ t('form.month') }}</span>
                        <!--月份下拉框-->
                        <el-select v-model="uploadMonth">
                            <el-option v-for="item in monthOptions" :key="item" :label="item" :value="item" />
                        </el-select>
                        <el-button type="primary" class="margin_10" slot="trigger">{{ t('form.selectFile') }}</el-button>
                    </el-upload>
                    <el-button type="primary" @click="submitUpload" class="margin_10" slot="default" :loading="uploading">{{
                        t('form.upload')
                    }}</el-button>
                </el-row>
            </div>
        </el-card>
    </el-dialog>
</template>
<script setup>
import { getMonths, getDepartments } from '@/apis/basic/base';
import { defaultDate } from '@/toolkit';
import { listPage, upload, download } from '@/apis/expenditure/own-manpower';
const { t } = useI18n();

//表格定义
const tableRef = ref();
const columns = computed(() => [
    { prop: "uid", label: t("thead.uid"), minWidth: 8 },
    { prop: "employeeDept", label: t("thead.employeeDept"), minWidth: 14 },
    { prop: "demandDept", label: t("thead.demandDept"), minWidth: 14 },
    { prop: "employeeCode", label: t("thead.employeeCode"), minWidth: 12 },
    { prop: "employeeName", label: t("thead.employeeName"), minWidth: 10 },
    { prop: "projectCode", label: t("thead.projectCode"), minWidth: 15 },
    { prop: "projectName", label: t("thead.projectName"), minWidth: 30 },
    { prop: "task", label: t("thead.task"), minWidth: 15 },
    { prop: "workHours", label: t("thead.workHours"), minWidth: 8 },
    { prop: "workDate", label: t("thead.workDate"), minWidth: 13 },
    { prop: "workDesc", label: t("thead.workDesc"), minWidth: 20 },
]);
const searchLoading = ref(false);
const findPage = () => {
    searchLoading.value = true;
    tableRef.value.reload();
    searchLoading.value = false;
}

//过滤器相关变量
const filters = reactive({
    month: '',
    employeeDept: '',
    employeeName: '',
    projectName: '',
    demandDept: '',
});

const monthOptions = ref([]);
onBeforeMount(() => {
    getMonths().then((res) => {
        monthOptions.value = res.data;
        filters.month = res.data.indexOf(defaultDate()) >= 0 ? defaultDate() : res.data[0];//初始化月份下拉框为最近的一个月
        findPage();
    });
});

const deptOptions = ref([]);
getDepartments().then((res) => {
    deptOptions.value = res.data;
});


//弹框页面相关
const dialogVisible = ref(false);
const showDialog = () => { dialogVisible.value = true; }
const closeDialog = () => { dialogVisible.value = false; }

const uploadMonth = ref('');
const uploadRef = ref();
const uploading = ref(false);
const fileList = ref([]);
const submitUpload = () => {
    if (!uploadMonth.value) {
        ElMessage({ message: t('tips.monthRequired'), type: 'error', showClose: true });
        return;
    }
    if (fileList.value.length === 0) {
        ElMessage({ message: t('tips.fileRequired'), type: 'error', showClose: true });
        return;
    }
    ElMessageBox
        .confirm(t('tips.uploadWarning'), t('tips.warning'), { confirmButtonText: t('action.confirm'), cancelButtonText: t('action.cancel'), type: 'warning' })
        .then(() => { uploadRef.value.submit(); }).catch();
}
function uploadRequest() {
    let params = new FormData();
    params.append('file', fileList.value[0].raw);
    uploading.value = true;
    upload(uploadMonth.value, params).then(res => {
        ElMessage({ type: "success", message: t('tips.successImport') + res.data });
        findPage();
    }).finally(() => {
        uploading.value = false;
    });
}

const downloadMonth = ref('');
const downloading = ref(false);
const doDownload = () => {
    if (!downloadMonth.value) {
        ElMessage({ message: t('tips.monthRequired'), type: 'error' });
        return;
    }
    downloading.value = true;
    download(downloadMonth.value).then((res) => {
        const link = document.createElement('a');
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", downloadMonth.value + ".xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch().finally(() => {
        downloading.value = false;
    });
}

//自适应高度
const tableHeight = ref();
onMounted(() => {
    tableHeight.value = window.innerHeight - tableRef.value.$el.offsetTop - 85;
    window.onresize = () => {
        tableHeight.value = window.innerHeight - tableRef.value.$el.offsetTop - 85;
    }
})
</script>
<style lang="scss">
.maintenance {
    float: right;
    padding-right: 0;
}

.card-header {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    font-size: larger;
}

.card-header-title {
    margin-left: 5px;
}

.margin_10 {
    margin-left: 10px;
    margin-right: 10px;
}
</style>