<template>
    <div class="main-body">
        <!--工具栏-->
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <!--预算年度-->
                <el-form-item>
                    <el-select v-model="filters.budgetYear">
                        <el-option v-for="item in budgetYearOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <!--预算部门下拉框-->
                <el-form-item>
                    <el-select v-model="filters.budgetDept" clearable :placeholder="t('form.budgetDept')">
                        <el-option v-for="item in deptOptions" :key="item.uid" :label="item.deptName"
                            :value="item.deptName" />
                    </el-select>
                </el-form-item>
                <!--业务类型下拉框-->
                <el-form-item>
                    <el-cascader :options="bizTypeTree" :props="cascaderProps" :collapse-tags=true
                        :collapse-tags-tooltip=true v-model="filters.bizTypeSelections" clearable
                        :placeholder="t('form.bizType')" />
                </el-form-item>
                <!--可能发生下拉框-->
                <el-form-item>
                    <el-select v-model="filters.possibleOccurrence" clearable :placeholder="t('form.possibleOccurrence')">
                        <el-option v-for="item in possibleOccurrenceOptions" :key="item.value" :label="item.name"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <!--查询按钮-->
                <el-form-item>
                    <el-tooltip effect="dark" :content="t('action.search')" placement="bottom">
                        <el-button icon="search" type="primary" @click="findPage" />
                    </el-tooltip>
                </el-form-item>
                <!--切换视图-->
                <el-form-item>
                    <el-radio-group v-model="viewer" @change="changeViewer">
                        <el-radio-button label="明细" />
                        <el-radio-button label="部门" />
                        <el-radio-button label="类型" />
                    </el-radio-group>
                </el-form-item>
                <!--进入维护页面-->
                <el-form-item class="maintenance">
                    <el-tooltip effect="dark" :content="t('maintenance')" placement="bottom">
                        <el-button icon="tools" type="default" @click="showDialog" circle />
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </div>
        <!--明细表格区-->
        <cm-table ref="detailTableRef" :get-page="listPageDetail" :filters="filters" :columns="columns"
            :showOperation="false" :showBatchDelete="false" :max-height="tableHeight">
        </cm-table>
    </div>
    <!--数据维护弹框-->
    <el-dialog :title="t('maintenance')" v-model="dialogVisible" draggable width="60%" :close-on-click-modal="false"
        @close="closeDialog" center>
        <!--下载-->
        <el-card>
            <template #header>
                <div class="card-header">
                    <el-icon size="large">
                        <Download />
                    </el-icon><span class="card-header-title">{{ t('dialog.export') }}</span>
                </div>
            </template>
            <div>
                <span class="margin_10">{{ t('form.year') }}</span>
                <!--年份下拉框-->
                <el-select v-model="downloadFilters.budgetYear">
                    <el-option v-for="item in budgetYearOptions" :key="item" :label="item" :value="item" />
                </el-select>
                <!--部门下拉框-->
                <span class="margin_10">{{ t('form.budgetDept') }}</span>
                <el-select v-model="downloadFilters.budgetDept" clearable :placeholder="t('form.select')">
                    <el-option v-for="item in deptOptions" :key="item.uid" :label="item.deptName" :value="item.deptName" />
                </el-select>
                <el-button type="primary" @click="doDownload" class="margin_10" slot="default" :loading="downloading">{{
                    t('form.download')
                }}</el-button>
            </div>
        </el-card>
        <el-divider />
        <!--上传-->
        <el-card>
            <template #header>
                <div class="card-header">
                    <el-icon size="large">
                        <Upload />
                    </el-icon>
                    <el-tooltip :content="t('dialog.manhourInternalImportTips')">
                        <span class="card-header-title">{{ t('dialog.import') }}</span>
                    </el-tooltip>
                </div>
            </template>
            <div>
                <el-row>
                    <el-upload ref="uploadRef" action :http-request="uploadRequest" v-model:file-list="fileList"
                        :auto-upload="false" :limit="1" accept=".xls,.xlsx">
                        <!--年份下拉框-->
                        <span class="margin_10">{{ t('form.month') }}</span>
                        <el-select v-model="uploadFilters.budgetYear">
                            <el-option v-for="item in budgetYearOptions" :key="item" :label="item" :value="item" />
                        </el-select>
                        <!--部门下拉框-->
                        <span class="margin_10">{{ t('form.budgetDept') }}</span>
                        <el-select v-model="uploadFilters.budgetDept" clearable :placeholder="t('form.select')">
                            <el-option v-for="item in deptOptions" :key="item.uid" :label="item.deptName"
                                :value="item.deptName" />
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
import { listPageDetail, download } from '@/apis/budget/dept-budget';
import { getBizTypeTree, getBizType1, getBizTypeSons } from '@/apis/basic/biz-list';
import { budgetYearOptions, possibleOccurrenceOptions } from '@/data';
const store = useStore();
const { t } = useI18n();
//过滤器
const filters = reactive({
    budgetYear: '2023',
    budgetDept: '',
    bizTypeSelections: [],
    possibleOccurrence: '',
});
const deptOptions = computed(() => { return store.state.departments });
const cascaderProps = {
    multiple: true,
    checkStrictly: false,
    emitPath: false,
}
const bizTypeTree = ref([]);
getBizTypeTree().then((res) => {
    bizTypeTree.value = res.data;
});
//视图模式
const viewer = ref('明细');
const changeViewer = () => {
    console.log(viewer.value);
}
//表格
const detailTableRef = ref();
const columns = computed(() => [
    { prop: "uid", label: t("thead.uid"), minWidth: 8 },
    { prop: "budgetDept", label: t("thead.budgetDept"), minWidth: 14 },
    { prop: "item", label: t("thead.item"), minWidth: 18 },
    { prop: "itemDesc", label: t("thead.itemDesc"), minWidth: 12 },
    { prop: "totalBudget", label: t("thead.totalBudget"), minWidth: 10 },
    { prop: "opexBudget", label: t("thead.opexBudget"), minWidth: 10 },
    { prop: "ownManpowerBudget", label: t("thead.ownManpowerBudget"), minWidth: 13 },
    { prop: "outsourcedManpowerBudget", label: t("thead.outsourcedManpowerBudget"), minWidth: 13 },
    { prop: "technicalServiceBudget", label: t("thead.technicalServiceBudget"), minWidth: 10 },
    { prop: "cloudBudget", label: t("thead.cloudBudget"), minWidth: 10 },
    { prop: "otherBudget", label: t("thead.otherBudget"), minWidth: 13 },
    { prop: "capexBudget", label: t("thead.capexBudget"), minWidth: 13 },
    { prop: "manhourInternal", label: t("thead.manhourInternal"), minWidth: 13 },
    { prop: "manhourExternal", label: t("thead.manhourExternal"), minWidth: 13 },
    { prop: "bizType1", label: t("thead.bizType1"), minWidth: 10 },
    { prop: "bizType2", label: t("thead.bizType2"), minWidth: 10 },
    { prop: "possibleOccurrence", label: t("thead.possibleOccurrence"), minWidth: 9 },
]);

const findPage = () => {
    detailTableRef.value.reload();
}

//弹框页面相关
const dialogVisible = ref(false);
const showDialog = () => { dialogVisible.value = true; }
const closeDialog = () => { dialogVisible.value = false; }
//下载
const downloadFilters = reactive({
    budgetYear: '2023',
    budgetDept: '',
});
const downloading = ref(false);
const doDownload = () => {
    downloading.value = true;
    let data;
    if (downloadFilters.budgetDept === '') {
        data = {
            budgetYear: downloadFilters.budgetYear,
            budgetDept: 'all'
        }
    } else {
        data = {
            budgetYear: downloadFilters.budgetYear,
            budgetDept: downloadFilters.budgetDept
        }
    }
    download(data).then((res) => {
        const link = document.createElement('a');
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", data.budgetYear + "-" + data.budgetDept + ".xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }).catch().finally(() => {
        downloading.value = false;
    });
}

const uploading = ref(false);
const uploadFilters = reactive({
    budgetYear: '2023',
    budgetDept: '',
});


const tableHeight = ref();
onMounted(() => {
    tableHeight.value = window.innerHeight - detailTableRef.value.$el.offsetTop - 85;
    window.onresize = () => {
        tableHeight.value = window.innerHeight - detailTableRef.value.$el.offsetTop - 85;
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