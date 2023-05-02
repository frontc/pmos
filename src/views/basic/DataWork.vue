<template>
    <div class="main-body">
        <el-card>
            <template #header>
                <div class="card-header">
                    <el-icon size="large">
                        <Checked />
                    </el-icon><span class="card-header-title">{{ t('dataSummary') }}</span>
                </div>
            </template>
            <div class="card-body">
                <el-form ref="dsFormRef" :model="dsForm" :rules="dsRules" :inline="true">
                    <!--月份下拉框-->
                    <el-form-item prop="dataSummaryMonth" :label="t('form.month')">
                        <el-select v-model="dsForm.dataSummaryMonth">
                            <el-option v-for="item in monthOptions" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <!--数据下拉框-->
                    <el-form-item prop="dataSummaryTarget" :label="t('form.target')">
                        <el-select v-model="dsForm.dataSummaryTarget">
                            <el-option v-for="item in summaryTargetOptions" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <!--汇总自有人力数据-->
                    <el-form-item>
                        <el-button type="primary" @click="doDataSummary(dsFormRef)" slot="default" :loading="collecting">{{
                            t('action.summary')
                        }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-divider />
        <el-card>
            <template #header>
                <div class="card-header">
                    <el-icon size="large">
                        <Management />
                    </el-icon>
                    <span class="card-header-title">{{ t('projectSummay') }}</span>
                </div>
            </template>
            <div class="card-body">
                <el-form ref="psFormRef" :model="psForm" :inline="true">
                    <!--项目状态下拉框-->
                    <el-form-item prop="projectStatus" :label="t('thead.projectStatus')">
                        <el-select v-model="psForm.projectStatus" clearable :placeholder="t('form.all')"
                            @change="projectStatusChange">
                            <el-option v-for="item in projectStatusOptions" :key="item.uid" :label="item.projectStatus"
                                :value="item.projectStatus" />
                        </el-select>
                    </el-form-item>
                    <!--项目下拉框-->
                    <el-form-item prop="projectNameList" :label="t('thead.projectName')">
                        <el-select v-model="psForm.projectNameList" clearable :placeholder="t('form.all')" multiple
                            collapse-tags collapse-tags-tooltip>
                            <el-option v-for="item in projectOptions" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <!--汇总项目数据-->
                    <el-form-item>
                        <el-button type="primary" @click="doProjectSummary" slot="default"
                            :loading="collecting">{{
                                t('action.summary')
                            }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
  
<script setup>
import { generateDataSummay, getDataSummaryTarget,generateProjectSummay } from '@/apis/basic/data-work';
import { getProjects } from '@/apis/budget/project-budget'
const { t } = useI18n();
const store = useStore();
//数据汇总区
const dsFormRef = ref();
const dsForm = reactive({
    dataSummaryMonth: '',
    dataSummaryTarget: '',
});
const monthOptions = computed(() => { return store.state.months });
const summaryTargetOptions = ref([]);
getDataSummaryTarget().then((res) => { summaryTargetOptions.value = res.data; })
const dsRules = computed(() => {
    return {
        dataSummaryMonth: [{ required: true, message: t('form.required'), trigger: ['blur'] },],
        dataSummaryTarget: [{ required: true, message: t('form.required'), trigger: ['blur'] },]
    }
});
const collecting = ref(false);
const doDataSummary = (dsFormRef) => {
    dsFormRef.validate((valid) => {
        if (valid) {
            collecting.value = true;
            generateDataSummay(dsForm).then((res) => {
                ElMessage({ type: 'success', message: t('tips.successGenerate') + res.data + " 行" });
            }).finally(() => {
                collecting.value = false;
            })
        } else {
            console.log(false);
        }
    });
}
//项目汇总区
const psFormRef = ref();
const psForm = reactive({
    projectStatus: '',
    projectNameList: [],
});
const projectStatusOptions = computed(() => { return store.state.projectStatus; });
const projectOptions = ref([]);
const projectStatusChange = () => {
    getProjects(psForm.projectStatus).then(res => {
        projectOptions.value = res.data;
        psForm.projectNameList = [];
    })
}
const doProjectSummary= ()=>{
    collecting.value = true;
    generateProjectSummay(psForm).then((res)=>{
        ElMessage({ type: 'success', message: t('tips.successGenerate') + res.data + " 行" });
    }).finally(()=>{
        collecting.value = false;
    })
}
projectStatusChange();

</script>
<style lang="scss">
.card-header {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    font-size: medium;
}

.card-header-title {
    margin-left: 5px;
}

.card-body {

    >button,
    >span {
        margin-left: 10px;
        margin-right: 10px;
    }

}

.margin_10 {
    margin-left: 10px;
    margin-right: 10px;
}
</style>