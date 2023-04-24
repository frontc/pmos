<template>
    <div class="main-body">
        <!--工具栏-->
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.bizType" :placeholder="t('form.bizType')" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.parentCode" clearable :placeholder="t('form.select')">
                        <el-option v-for="item in bizType1Options" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button icon="search" type="primary" @click="findPage">{{ t('action.search') }}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button icon="plus" type="primary" @click="handleAdd">{{ t('action.add') }}</el-button>
                </el-form-item>
                <el-form-item class="export">
                    <el-button icon="download" type="primary" @click="exportExcel" :loading="downloading">{{ t('action.export') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--表格区-->
        <cm-table id="data-table" ref="tableRef" :get-page="listPage" :filters="filters" :columns="columns"
            :showOperation="true" :showBatchDelete="false" @handleEdit="handleEdit" @handleDelete="handleDelete"  :max-height="tableHeight">
        </cm-table>
    </div>
    <!--新增/编辑弹框-->
    <el-dialog :title="isEdit ? t('action.edit') : t('action.add')" v-model="dialogVisible" draggable width="50%"
        :close-on-click-modal="false" @close="closeDialog" center>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" label-position="right">
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="t('thead.parentCode')" prop="parentCode">
                        <el-select v-model="form.parentCode" clearable :placeholder="t('form.select')"
                            @change="refreshLevelID">
                            <el-option v-for="item in bizType1Options" :key="item.value"
                                :label="`${item.value}-${item.label}`" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="t('thead.levelID')" prop="levelID">
                        <el-input v-model="form.levelID" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="t('thead.bizTypeCode')" prop="bizTypeCode">
                        <el-input v-model="form.bizTypeCode"></el-input>
                    </el-form-item></el-col>
                <el-col :span="12">
                    <el-form-item :label="t('thead.bizType')" prop="bizType">
                        <el-input v-model="form.bizType"></el-input>
                    </el-form-item></el-col>
            </el-row>
            <el-form-item :label="t('thead.relatedDept')" prop="relatedDept">
                <el-select v-model="form.relatedDept" clearable :placeholder="t('form.select')">
                    <el-option v-for="item in deptOptions" :key="item.uid" :label="item.deptName" :value="item.deptName" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleEmpty" :disabled="isEdit">{{ t("action.empty") }}</el-button>
            <el-button type="primary" :loading="formLoading" @click="handleSubmit(formRef)">{{ t("action.submit")
            }}</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { listPage, getBizType1, submitPage, remove, checkBizTypeCode, download } from '@/apis/basic/biz-list';
import { getDepartments } from '@/apis/basic/departments';
// import * as FileSaver from "file-saver";
// import * as XLSX from "xlsx";
const { t } = useI18n();

//表格定义
const tableRef = ref();
const columns = computed(() => [
    { prop: "uid", label: t("thead.uid"), minWidth: 15 },
    { prop: "bizTypeCode", label: t("thead.bizTypeCode"), minWidth: 40 },
    { prop: "bizType", label: t("thead.bizType"), minWidth: 100 },
    { prop: "relatedDept", label: t("thead.relatedDept"), minWidth: 50 },
    { prop: "parentCode", label: t("thead.parentCode"), minWidth: 15 },
    { prop: "levelID", label: t("thead.levelID"), minWidth: 15 },
]);

const findPage = () => {
    tableRef.value.reload();
}

//过滤器相关变量
const filters = reactive({
    bizType: '',
    parentCode: '',
});

//弹框页面相关
const isEdit = ref(false);
const dialogVisible = ref(false);
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

function handleAdd() {
    dialogVisible.value = true;
    isEdit.value = false;
}

const oldBizTypeCode = ref('');
function handleEdit(row) {
    dialogVisible.value = true;
    isEdit.value = true;
    Object.assign(form, row);
    oldBizTypeCode.value = row.bizTypeCode;
}

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

function handleDelete(ids) {
    remove(ids);
    findPage();
}

const downloading = ref(false);
const exportExcel = () =>{
    downloading.value = true;
    download().then((res) => {
        const link = document.createElement('a');
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "业务类型.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch().finally(() => {
        downloading.value = false;
    });
}

// const exportExcel = () => {
//     /* 从表生成工作簿对象 */
//     var wb = XLSX.utils.table_to_book(document.querySelector("#data-table"));
//     /* 获取二进制字符串作为输出 */
//     var wbout = XLSX.write(wb, {
//         bookType: "xlsx",
//         bookSST: true,
//         type: "array"
//     });
//     try {
//         FileSaver.saveAs(
//             //Blob 对象表示一个不可变、原始数据的类文件对象。
//             //Blob 表示的不一定是JavaScript原生格式的数据。
//             //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
//             //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
//             new Blob([wbout], { type: "application/octet-stream" }),
//             //设置导出文件名称
//             Date.parse(new Date()) + ".xlsx"
//         );
//     } catch (e) {
//         if (typeof console !== "undefined") console.log(e, wbout);
//     }
//     return wbout;
// }


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