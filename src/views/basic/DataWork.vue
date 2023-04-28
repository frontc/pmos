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
                        <el-button type="primary" @click="doSummary(dsFormRef)" slot="default" :loading="collecting">{{
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
                <el-row>
                    <el-upload ref="uploadRef" action :http-request="uploadRequest" v-model:file-list="fileList"
                        :auto-upload="false" :limit="1" accept=".xls,.xlsx">
                        <span>{{ t('form.month') }}</span>
                        <!--月份下拉框-->
                        <el-select v-model="uploadMonth">
                            <el-option v-for="item in monthOptions" :key="item" :label="item" :value="item" />
                        </el-select>
                        <el-button type="primary" slot="trigger">{{ t('form.selectFile') }}</el-button>
                    </el-upload>
                    <el-button type="primary" @click="submitUpload" slot="default" :loading="uploading">{{
                        t('form.upload')
                    }}</el-button>
                </el-row>
            </div>
        </el-card>
    </div>
</template>
  
<script setup>
import { startCalcSummary, getDataSummaryTarget } from '@/apis/basic/data-work';
import { ElMessage } from 'element-plus';
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
const doSummary = (dsFormRef) => {
    dsFormRef.validate((valid) => {
        if (valid) {
            collecting.value = true;
            startCalcSummary(dsForm).then((res) => {
                ElMessage({ type: 'success', message: t('tips.successGenerate') + res.data + " 行" });
            }).finally(() => {
                collecting.value = false;
            })
        } else {
            console.log(false);
        }
    });
}

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