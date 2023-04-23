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
                    <el-button icon="tools" type="default" @click="showMaintenanceDialog" circle></el-button>
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
                        <Upload />
                    </el-icon><span class="card-header-title">数据导入</span>
                </div>
            </template>
            <div>
                <el-row>

                    <el-upload ref="uploadRef" action :http-request="uploadRequest" v-model:file-list="fileList"
                        :auto-upload="false" :limit="1" accept=".xls,.xlsx">
                        <span class="margin_10">月份</span>
                        <!--月份下拉框-->
                        <el-select v-model="uploadMonth">
                            <el-option v-for="item in monthOptions" :key="item" :label="item" :value="item" />
                        </el-select>
                        <el-button type="primary" class="margin_10" slot="trigger">{{ t('form.selectFile') }}</el-button>
                    </el-upload>
                    <el-button type="primary" @click="submitUpload" class="margin_10"
                        slot="default">{{ t('form.upload') }}</el-button>
                </el-row>
            </div>
        </el-card>
        <el-divider />
        <el-card>
            <template #header>
                <div class="card-header">
                    <el-icon size="large">
                        <Download />
                    </el-icon><span class="card-header-title">数据导出</span>
                </div>
            </template>
            <div>内容</div>
        </el-card>
    </el-dialog>
</template>
<script setup>
import { getDepartments } from '@/apis/basic/departments';
import { getMonths } from '@/apis/basic/base';
import { defaultDate } from '@/toolkit';
import { listPage,upload } from '@/apis/expenditure/own-manpower';

import { getBizType1, submitPage, checkBizTypeCode } from '@/apis/basic/biz-list';

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { file } from '@babel/types';
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

//弹框页面相关
const dialogVisible = ref(false);
const showMaintenanceDialog = () => {
    dialogVisible.value = true;
}
const uploadMonth = ref('');
const uploadRef = ref();
const fileList = ref([]);
const submitUpload = () => {
    if (!uploadMonth.value) {
        ElMessage({ message: '请选择月份', type: 'error', showClose: true });
        return;
    }
    if (fileList.value.length === 0) {
        ElMessage({ message: '请先选择要上传的文件', type: 'error', showClose: true });
        return;
    }
    uploadRef.value.submit();
}

function uploadRequest() {
    let params = new FormData();

    params.append('file',fileList.value[0].raw);
    console.log(fileList.value[0].raw);
    upload(uploadMonth.value,params).then(res=>{
        console.log(res);
    });
}

function UploadUrl() {
    return ""
}


const formRef = ref();
const form = reactive({
    uid: '',
    bizTypeCode: '',
    bizType: '',
    relatedDept: '',
    parentCode: '',
    levelID: 1,
});






const validateBizTypeCode = (rule, value, callback) => {
    let valueString = value.toString();
    if (valueString === '') {
        callback(new Error(t("form.bizTypeCodeRequired")));
    } else {
        if (form.levelID === 1 && valueString.length !== 2) {
            callback(new Error(t("form.bizTypeCode1LengthError")));
        } else if (form.levelID === 2 && valueString.length !== 6) {
            callback(new Error(t("form.bizTypeCode2LengthError")));
        } else if (form.levelID === 2 && !valueString.startsWith(form.parentCode)) {
            console.log(valueString, form.parentCode);
            callback(new Error(t("form.bizTypeCode2TypoError")));
        } else {
            if (isEdit && value === oldBizTypeCode.value) callback();
            checkBizTypeCode(valueString).then((res) => {
                if (res.data) {
                    callback();
                } else {
                    callback(new Error(t("form.bizTypeCodeRepeatedError")));
                }
            })
        }
    }
};

const rules = computed(() => {
    return {
        bizTypeCode: [{ validator: validateBizTypeCode, trigger: ['blur'] }],
        bizType: [{ required: true, message: t('form.bizTypeRequired'), trigger: ['blur', 'change'] }],
    }
});
const bizType1Options = ref([]);
getBizType1().then((res) => {
    bizType1Options.value = res.data;
});

function refreshLevelID() {
    if (form.parentCode === '' || form.parentCode === null || form.parentCode === 0) {
        form.levelID = 1;
    } else {
        form.levelID = 2;
    }
}
const deptOptions = ref([]);
getDepartments().then((res) => {
    deptOptions.value = res.data;
});


const oldBizTypeCode = ref('');


function handleEmpty() {
    let initForm = {
        uid: '',
        bizTypeCode: '',
        bizType: '',
        relatedDept: '',
        parentCode: '',
        levelID: 1,
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

const exportExcel = () => {
    /* 从表生成工作簿对象 */
    var wb = XLSX.utils.table_to_book(document.querySelector("#data-table"));
    /* 获取二进制字符串作为输出 */
    var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
    });
    try {
        FileSaver.saveAs(
            //Blob 对象表示一个不可变、原始数据的类文件对象。
            //Blob 表示的不一定是JavaScript原生格式的数据。
            //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
            //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
            new Blob([wbout], { type: "application/octet-stream" }),
            //设置导出文件名称
            Date.parse(new Date()) + ".xlsx"
        );
    } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
    }
    return wbout;
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