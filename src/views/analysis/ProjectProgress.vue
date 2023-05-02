<template>
    <div class="main-body">
        <!--工具栏---->
        <div class="toolbar">
            <el-form :inline="true" :model="filters" :rules="rules" ref="formRef">
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
                <!--项目状态下拉框-->
                <el-form-item>
                    <el-select v-model="filters.projectStatus" clearable :placeholder="t('form.projectStatus')">
                        <el-option v-for="item in projectStatusOptions" :key="item.uid" :label="item.projectStatus"
                            :value="item.projectStatus" />
                    </el-select>
                </el-form-item>
                <!--项目名称输入框-->
                <el-form-item prop="projectName">
                    <el-input v-model="filters.projectName" :placeholder="t('form.projectName')" clearable></el-input>
                </el-form-item>
                <!--项目进度输入框-->
                <el-form-item prop="totalProgress">
                    <el-input v-model="filters.totalProgress" :placeholder="t('form.totalProgress')" clearable></el-input>
                </el-form-item>
                <!--查询按钮-->
                <el-form-item>
                    <el-tooltip effect="dark" :content="t('action.search')" placement="bottom">
                        <el-button icon="search" type="primary" @click="findPage" :loading="loading"></el-button>
                    </el-tooltip>
                </el-form-item>
                <el-form-item class="export">
                    <el-tooltip effect="dark" :content="t('action.export')" placement="bottom">
                        <el-button icon="download" type="primary" @click="exportExcel" :loading="downloading" circle/>
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </div>

        <!--表格区-->
        <div v-loading="loading" class="cm-table">
            <el-table :data="data.content" class="cm-table__tb">
                <template v-for="column in columns">
                    <el-table-column v-if="column.type === 'normal'" :key="column.prop" :label="column.label"
                        :min-width="column.minWidth" :prop="column.prop" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column v-if="column.type === 'progress'" :key="column.prop" :label="column.label"
                        :min-width="column.minWidth">
                        <template #default="scope">
                            <el-popover placement="top-start" :width="100" trigger="hover">
                                <template #reference>
                                    <el-progress :text-inside="true" :stroke-width="16"
                                        :percentage='Number(fixed(scope.row[column.prop], 2))'
                                        :color="progressColor(scope.row[column.prop], scope.row[column.related[0]], scope.row[column.related[1]])" />
                                </template>
                                <div>
                                    <el-row>
                                        <el-col>{{ t('budget') }}: {{ scope.row[column.related[0]] }}</el-col>
                                        <el-col>{{ t('actual') }}: {{ scope.row[column.related[1]] }}</el-col>
                                    </el-row>
                                </div>
                            </el-popover>

                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <!--分页栏-->
            <div class="cm-table__toolbar">
                <el-pagination v-if="showPagination" class="cm-table__pagination" v-model:currentPage="pageRequest.pageNum"
                    v-model:page-size="pageRequest.pageSize" :total="data.totalSize || 0" :page-sizes="[10, 20, 50, 100]"
                    layout="total, prev, pager, next, sizes, jumper" @size-change="handleSizeChange"
                    @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script setup>
import { listPage, download } from '@/apis/analysis/project-progress';
import { fixed, isNumber } from '@/toolkit';
const store = useStore();
const { t } = useI18n();
//过滤条件
const formRef = ref();
const filters = reactive({
    projectName: '',
    projectType: '',
    dept: '',
    projectStatus: '',
    totalProgress: '',
});
const projectTypeOptions = computed(() => { return store.state.projectTypes; });
const deptOptions = computed(() => { return store.state.departments; });
const projectStatusOptions = computed(() => { return store.state.projectStatus; });
const validateFloat = (rule, value, callback) => {
    if (value === '' || isNumber(value)) {
        callback();
    } else {
        callback(new Error(t("form.floatRequired")));
    }
};

const validateBlank = (rule, value, callback) => {
    if (!value) callback();
    let valueStr = value.toString();
    if (valueStr.indexOf(' ') == -1) { callback() } else {
        callback(new Error(t('form.blankError')));
    }
};
const rules = computed(() => {
    return {
        projectName: [{ validator: validateBlank, trigger: ['blur'] }],
        totalProgress: [{ validator: validateFloat, trigger: ['blur'] }, { validator: validateBlank, trigger: ['blur'] }],
    }
});

//表格
const loading = ref(false);
//列定义，增加列类型：nomarl还是progress
const columns = computed(() => [
    { prop: "uid", label: t("thead.uid"), minWidth: 15, type: 'normal' },
    // { prop: "projectCode", label: t("thead.projectCode"), minWidth: 40, type: 'normal' },
    { prop: "projectName", label: t("thead.projectName"), minWidth: 100, type: 'normal' },
    { prop: "totalProgress", label: t("thead.totalProgress"), minWidth: 30, type: 'progress', related: ['totalBudget', 'totalCost'] },
    { prop: "ownManpowerProgress", label: t("thead.ownManpowerProgress"), minWidth: 30, type: 'progress', related: ['ownManpowerBudget', 'ownManpowerCost'] },
    { prop: "outsourcedManpowerProgress", label: t("thead.outsourcedManpowerProgress"), minWidth: 30, type: 'progress', related: ['outsourcedManpowerBudget', 'outsourcedManpowerCost'] },
    { prop: "technicalServiceProgress", label: t("thead.technicalServiceProgress"), minWidth: 35, type: 'progress', related: ['technicalServiceFeeBudget', 'technicalServiceCost'] },
    { prop: "capexProgress", label: t("thead.capexProgress"), minWidth: 30, type: 'progress', related: ['capexBudget', 'capexCost'] },
    { prop: "cloudProgress", label: t("thead.cloudProgress"), minWidth: 30, type: 'progress', related: ['cloudFeeBudget', 'cloudCost'] },
    { prop: "otherProgress", label: t("thead.otherProgress"), minWidth: 30, type: 'progress', related: ['otherBudget', 'otherCost'] },
    { prop: "manhourInternalProgress", label: t("thead.manhourInternalProgress"), minWidth: 30, type: 'progress', related: ['manhourInternalTotal', 'manhourInternal'] },
    { prop: "manhourExternalProgress", label: t("thead.manhourExternalProgress"), minWidth: 30, type: 'progress', related: ['manhourExternalTotal', 'manhourExternal'] },
    { prop: "projectStatus", label: t("thead.projectStatus"), minWidth: 30, type: 'normal' },
    { prop: "updateDate", label: t("thead.updateDate"), minWidth: 40, type: 'normal' },
]);
const data = ref({});
function findPage() {
    loading.value = true;
    listPage({ ...pageRequest, ...filters }).then((res) => {
        data.value = {
            content: res.data.records,
            totalSize: res.data.total
        };
    }).catch().finally(() => { loading.value = false });
}
const progressColor = (progress, budget, actual) => {
    if (progress > 1 || actual > budget) return '#f56c6c'; //红色f56c6c
    if (progress > 0.8) return '#e6a23c';//黄色
    return '#1989fa';//蓝色 1989fa
}
//分页
const showPagination = ref(true);
const pageRequest = reactive({
    pageNum: 1,
    pageSize: 10,
})
function handleSizeChange(pageSize) {
    pageRequest.pageSize = pageSize;
    pageRequest.pageNum = 1;
    findPage();
}
// 换页刷新
function handlePageChange(pageNum) {
    pageRequest.pageNum = pageNum;
    findPage();
}
function reload() {
    handlePageChange(1);
}
reload();
// 导出EXCEL
const downloading = ref(false);
const exportExcel = () => {
    downloading.value = true;
    download().then((res) => {
        const link = document.createElement('a');
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "项目预算执行情况表.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch().finally(() => {
        downloading.value = false;
    });
}

</script>
<style lang="scss" scoped>
.cm-table__tb {
    border: 1px solid #eee;
    border-bottom: none;
    min-width: 100%;

}

.cm-table__toolbar {
    padding: 10px 5px;

    &:after {
        content: "";
        display: table;
        clear: both;
    }
}

.cm-table__pagination {
    float: right;
    padding-right: 0;
}

.danger {
    color: var(--el-color-danger) !important;
}

.el-link {
    margin-right: 8px;
}

.export {
    float: right;
    padding-right: 0;
}
</style>