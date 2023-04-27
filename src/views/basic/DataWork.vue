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
                    <el-icon size="large">
                        <Management />
                    </el-icon>
                    <span class="card-header-title">{{ t('projectSummay') }}</span>
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
    </div>
</template>
  
<script setup>
const { t } = useI18n();
const store = useStore();

const monthOptions = computed(() => { return store.state.months });

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

.margin_10 {
    margin-left: 10px;
    margin-right: 10px;
}
</style>