<template>
    <div class="main-body">
        <!--工具栏-->
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <!--项目类型下拉框-->
                <el-form-item>
                    <el-select v-model="filters.projectType" :placeholder="t('form.projectType')" clearable>
                        <el-option v-for="item in projectTypeOptions" :key="item" :label="item.projectType"
                            :value="item.projectType" />
                    </el-select>
                </el-form-item>
                <!--部门下拉框-->
                <el-form-item>
                    <el-select v-model="filters.dept" clearable :placeholder="t('form.dept')">
                        <el-option v-for="item in deptOptions" :key="item.uid" :label="item.deptName"
                            :value="item.deptName" />
                    </el-select>
                </el-form-item>
                <!--项目名称输入框-->
                <el-form-item>
                    <el-input v-model="filters.projectName" :placeholder="t('form.projectName')" clearable></el-input>
                </el-form-item>
                <!--立项月份输入框-->
                <el-form-item>
                    <el-input v-model="filters.projectMonth" :placeholder="t('form.projectMonth')" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="search" type="primary" @click="findPage">{{ t('action.search') }}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button icon="plus" type="primary" @click="handleAdd">{{ t('action.add') }}</el-button>
                </el-form-item>
                <el-form-item class="export">
                    <el-button icon="download" type="primary" @click="exportExcel" :loading="downloading">{{
                        t('action.export') }}</el-button>
                </el-form-item>
            </el-form>

        </div>
        <!--表格区-->
        <cm-table id="data-table" ref="tableRef" :get-page="listPage" :filters="filters" :columns="columns"
            :showOperation="true" :showBatchDelete="false" @handleEdit="handleEdit" @handleDelete="handleDelete"
            :max-height="tableHeight" :oprWidth="100">
        </cm-table>
    </div>
    <!--新增/编辑弹框-->
    <el-dialog :title="isEdit ? t('action.edit') : t('action.add')" v-model="dialogVisible" draggable width="60%"
        :close-on-click-modal="false" @close="closeDialog" center>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="right">
            <el-row>
                <el-col :span="8">
                    <!--项目编号-->
                    <el-form-item :label="t('thead.projectCode')" prop="projectCode">
                        <el-input v-model="form.projectCode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <!--项目名称-->
                    <el-form-item :label="t('thead.projectName')" prop="projectName">
                        <el-input v-model="form.projectName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <!--项目类型-->
                    <el-form-item :label="t('thead.projectType')" prop="projectType">
                        <el-select v-model="form.projectType" clearable :placeholder="t('form.select')">
                            <el-option v-for="item in projectTypeOptions" :key="item.uid" :label="item.projectType"
                                :value="item.projectType" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!--部门-->
                    <el-form-item :label="t('thead.dept')" prop="dept">
                        <el-select v-model="form.dept" clearable :placeholder="t('form.select')">
                            <el-option v-for="item in deptOptions" :key="item.uid" :label="item.deptName"
                                :value="item.deptName" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <!--项目经理-->
                    <el-form-item :label="t('thead.projectManager')" prop="projectManager">
                        <el-input v-model="form.projectManager"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--预算-->
            <el-row>
                <el-col :span="8"> <el-form-item :label="t('thead.totalBudget')" prop="totalBudget">
                        <el-input v-model="form.totalBudget" disabled></el-input>
                    </el-form-item></el-col>
                <el-col :span="8"> <el-form-item :label="t('thead.manhourInternalTotal')" prop="manhourInternalTotal">
                        <el-input v-model="form.manhourInternalTotal"></el-input>
                    </el-form-item></el-col>
                <el-col :span="8"> <el-form-item :label="t('thead.manhourExternalTotal')" prop="manhourExternalTotal">
                        <el-input v-model="form.manhourExternalTotal"></el-input>
                    </el-form-item></el-col>

            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="t('thead.ownManpowerBudget')" prop="ownManpowerBudget">
                        <el-input v-model="form.ownManpowerBudget"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="t('thead.outsourcedManpowerBudget')" prop="outsourcedManpowerBudget">
                        <el-input v-model="form.outsourcedManpowerBudget"></el-input>
                    </el-form-item></el-col>
                <el-col :span="8"> <el-form-item :label="t('thead.technicalServiceFeeBudget')"
                        prop="technicalServiceFeeBudget" >
                        <el-input v-model="form.technicalServiceFeeBudget"></el-input>
                    </el-form-item></el-col>
            </el-row>
            <el-row>
                <el-col :span="8"> <el-form-item :label="t('thead.capexBudget')" prop="capexBudget">
                        <el-input v-model="form.capexBudget"></el-input>
                    </el-form-item></el-col>
                <el-col :span="8"> <el-form-item :label="t('thead.cloudFeeBudget')" prop="cloudFeeBudget">
                        <el-input v-model="form.cloudFeeBudget"></el-input>
                    </el-form-item></el-col>
                <el-col :span="8"> <el-form-item :label="t('thead.otherBudget')" prop="otherBudget">
                        <el-input v-model="form.otherBudget"></el-input>
                    </el-form-item></el-col>
            </el-row>
            <el-row>
                <el-col :span="6"> <!--起止时间-->
                    <el-form-item :label="t('thead.scheduledStartDate')" prop="scheduledStartDate">
                        <el-date-picker v-model="form.scheduledStartDate" type="date" :placeholder="t('form.select')"
                            value-format="YYYY-MM-DD" />
                    </el-form-item></el-col>
                <el-col :span="6"> <el-form-item :label="t('thead.scheduledEndDate')" prop="scheduledEndDate">
                        <el-date-picker v-model="form.scheduledEndDate" type="date" :placeholder="t('form.select')"
                            value-format="YYYY-MM-DD" />
                    </el-form-item></el-col>
                <el-col :span="6"> <!--立项月份-->
                    <el-form-item :label="t('thead.projectMonth')" prop="projectMonth">
                        <el-select v-model="form.projectMonth" clearable :placeholder="t('form.select')">
                            <el-option v-for="item in monthOptions" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item></el-col>
                <el-col :span="6">
                    <!--项目状态-->
                    <el-form-item :label="t('thead.projectStatus')" prop="projectStatus">
                        <el-select v-model="form.projectStatus" clearable :placeholder="t('form.select')">
                            <el-option v-for="item in projectStatusOptions" :key="item.uid" :label="item.projectStatus"
                                :value="item.projectStatus" />
                        </el-select>
                    </el-form-item></el-col>
            </el-row>
        </el-form>
        <template #footer>
            <el-button @click="handleEmpty" :disabled="isEdit">{{ t("action.empty") }}</el-button>
            <el-button type="primary" :loading="formLoading" @click="handleSubmit(formRef)">{{ t("action.submit")
            }}</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { listPage, submitPage, remove, download } from '@/apis/budget/project-budget';
import { getProjectStatus } from '@/apis/basic/base';
import { isNumber, toFloat } from '@/toolkit';
const { t } = useI18n();
const store = useStore();
//过滤器
const filters = reactive({
    projectName: '',
    projectType: '',
    dept: '',
    projectMonth: ''
});
const projectTypeOptions = computed(() => { return store.state.projectTypes; });
const deptOptions = computed(() => { return store.state.departments; });
const monthOptions = computed(() => { return store.state.months; });
const projectStatusOptions = ref([]);
getProjectStatus().then(res => {
    projectStatusOptions.value = res.data;
});
//表格
const tableRef = ref();
const columns = computed(() => [
    { prop: "uid", label: t("thead.uid"), minWidth: 4 },
    { prop: "dept", label: t("thead.dept"), minWidth: 9 },
    { prop: "projectCode", label: t("thead.projectCode"), minWidth: 11 },
    { prop: "projectName", label: t("thead.projectName"), minWidth: 18 },
    // { prop: "projectType", label: t("thead.projectType"), minWidth: 10 },
    { prop: "projectManager", label: t("thead.projectManager"), minWidth: 8 },
    { prop: "totalBudget", label: t("thead.totalBudget"), minWidth: 8 },
    { prop: "ownManpowerBudget", label: t("thead.ownManpowerBudget"), minWidth: 8 },
    { prop: "outsourcedManpowerBudget", label: t("thead.outsourcedManpowerBudget"), minWidth: 8 },
    { prop: "technicalServiceFeeBudget", label: t("thead.technicalServiceFeeBudget"), minWidth: 8 },
    { prop: "capexBudget", label: t("thead.capexBudget"), minWidth: 7 },
    { prop: "cloudFeeBudget", label: t("thead.cloudFeeBudget"), minWidth: 7 },
    { prop: "otherBudget", label: t("thead.otherBudget"), minWidth: 8 },
    // { prop: "manhourInternalTotal", label: t("thead.manhourInternalTotal"), minWidth: 10 },
    // { prop: "manhourExternalTotal", label: t("thead.manhourExternalTotal"), minWidth: 10 },
    // { prop: "scheduledStartDate", label: t("thead.scheduledStartDate"), minWidth: 10 },
    { prop: "scheduledEndDate", label: t("thead.scheduledEndDate"), minWidth: 10 },
    // { prop: "projectMonth", label: t("thead.projectMonth"), minWidth: 10 },
    // { prop: "projectStatus", label: t("thead.projectStatus"), minWidth: 10 },
]);
const findPage = () => {
    tableRef.value.reload();
}
//弹窗
const isEdit = ref(false);
const dialogVisible = ref(false);
const formLoading = ref(false);
const formRef = ref();
const form = reactive({
    uid: '',
    dept: '',
    projectCode: '',
    projectName: '',
    projectType: '',
    projectManager: '',
    totalBudget: computed(() => {
        return toFloat(form.ownManpowerBudget)
            + toFloat(form.outsourcedManpowerBudget)
            + toFloat(form.technicalServiceFeeBudget)
            + toFloat(form.capexBudget)
            + toFloat(form.cloudFeeBudget)
            + toFloat(form.otherBudget);
    }),
    ownManpowerBudget: '',
    outsourcedManpowerBudget: '',
    technicalServiceFeeBudget: '',
    capexBudget: '',
    cloudFeeBudget: '',
    otherBudget: '',
    manhourInternalTotal: '',
    manhourExternalTotal: '',
    scheduledStartDate: '',
    scheduledEndDate: '',
    projectMonth: '',
    projectStatus: '',
});

const validateFloat = (rule, value, callback) => {
    if (value === '' || isNumber(value)) {
        callback();
    } else {
        callback(new Error(t("form.floatRequired")));
    }
};

const validateBlank = (rule, value, callback) => {
    let valueStr = value.toString();
    if (valueStr.indexOf(' ') == -1) { callback() } else {
        callback(new Error(t('form.blankError')));
    }
}

const rules = computed(() => {
    return {
        projectName: [
            { required: true, message: t('form.required'), trigger: ['blur'] },
            { min: 2, max: 60, message: t('form.projectNameError'), trigger: ['blur'] },
            { validator: validateBlank, trigger: ['blur'] }
        ],
        projectType: [
            { required: true, message: t('form.required'), trigger: ['blur', 'change'] },
        ],
        dept: [
            { required: true, message: t('form.required'), trigger: ['blur', 'change'] },
        ],
        projectManager: [
            { required: true, message: t('form.required'), trigger: ['blur', 'change'] },
            { validator: validateBlank, trigger: ['blur'] }
        ],
        scheduledStartDate: [
            { required: true, message: t('form.required'), trigger: ['blur', 'change'] },
        ],
        scheduledEndDate: [
            { required: true, message: t('form.required'), trigger: ['blur', 'change'] },
        ],
        projectMonth: [
            { required: true, message: t('form.required'), trigger: ['blur', 'change'] },
        ],
        projectStatus: [
            { required: true, message: t('form.required'), trigger: ['blur', 'change'] },
        ],
        projectCode: [{ validator: validateBlank, trigger: ['blur'] }],
        ownManpowerBudget: [{ validator: validateFloat, trigger: ['blur'] }, { validator: validateBlank, trigger: ['blur'] }],
        outsourcedManpowerBudget: [{ validator: validateFloat, trigger: ['blur'] }, { validator: validateBlank, trigger: ['blur'] }],
        technicalServiceFeeBudget: [{ validator: validateFloat, trigger: ['blur'] }, { validator: validateBlank, trigger: ['blur'] }],
        capexBudget: [{ validator: validateFloat, trigger: ['blur'] }, { validator: validateBlank, trigger: ['blur'] }],
        cloudFeeBudget: [{ validator: validateFloat, trigger: ['blur'] }, { validator: validateBlank, trigger: ['blur'] }],
        otherBudget: [{ validator: validateFloat, trigger: ['blur'] }, { validator: validateBlank, trigger: ['blur'] }],
        manhourInternalTotal: [{ validator: validateFloat, trigger: ['blur'] }, { validator: validateBlank, trigger: ['blur'] }],
        manhourExternalTotal: [{ validator: validateFloat, trigger: ['blur'] }, { validator: validateBlank, trigger: ['blur'] }],
    }
});

function handleAdd() {
    dialogVisible.value = true;
    isEdit.value = false;
}

function handleEdit(row) {
    dialogVisible.value = true;
    isEdit.value = true;
    form.uid = row.uid;
    form.dept = row.dept;
    form.projectCode = row.projectCode;
    form.projectName = row.projectName;
    form.projectType = row.projectType;
    form.projectManager = row.projectManager;
    form.ownManpowerBudget = row.ownManpowerBudget;
    form.outsourcedManpowerBudget = row.outsourcedManpowerBudget;
    form.technicalServiceFeeBudget = row.technicalServiceFeeBudget;
    form.capexBudget = row.capexBudget;
    form.cloudFeeBudget = row.cloudFeeBudget;
    form.otherBudget = row.otherBudget;
    form.manhourInternalTotal = row.manhourInternalTotal;
    form.manhourExternalTotal = row.manhourExternalTotal;
    form.scheduledStartDate = row.scheduledStartDate;
    form.scheduledEndDate = row.scheduledEndDate;
    form.projectMonth = row.projectMonth;
    form.projectStatus = row.projectStatus;
}

function handleEmpty() {
    let initForm = {
        uid: '',
        dept: '',
        projectCode: '',
        projectName: '',
        projectType: '',
        projectManager: '',
        // totalBudget: '',
        ownManpowerBudget: '',
        outsourcedManpowerBudget: '',
        technicalServiceFeeBudget: '',
        capexBudget: '',
        cloudFeeBudget: '',
        otherBudget: '',
        manhourInternalTotal: '',
        manhourExternalTotal: '',
        scheduledStartDate: '',
        scheduledEndDate: '',
        projectMonth: '',
        projectStatus: '',
    };
    Object.assign(form, initForm);
}

function closeDialog() {
    dialogVisible.value = false;
}


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
    remove(ids).then(() => {
        findPage();
    });
}

const downloading = ref(false);
const exportExcel = () => {
    downloading.value = true;
    download().then((res) => {
        const link = document.createElement('a');
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "项目预算表.xlsx");
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
.el-cascader__tags {
    display: inline-flex;
    flex-wrap: nowrap;
    margin-right: 60px;
}

.export {
    float: right;
    padding-right: 0;
}
</style>