<template>
    <div class="header-cont">
        <div class="left">
            <h1><router-link to="/">{{ t('sitename') }}</router-link></h1>
        </div>
        <div class="right flex-center">
            <div class="lang gap">
                <span class="item" :class="{ active: locale === 'zh-cn' }" @click="changeLanguage('zh-cn')">简体中文</span>/
                <span class="item" :class="{ active: locale === 'en' }" @click="changeLanguage('en')">EN</span>
            </div>
            <template v-if="isLogin">
                <div class="gap">
                    <router-link to="/personal/message">
                        <el-badge :is-dot="!!unReadCount"> <el-icon>
                                <message></message>
                            </el-icon></el-badge>

                    </router-link>
                </div>
                <el-dropdown trigger="click" @command="handleCommand">
                    <div class="flex-center cursor">{{ username }}<el-icon><caret-bottom></caret-bottom></el-icon></div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="toPersonal">{{ t('personalCenter') }}</el-dropdown-item>
                            <el-dropdown-item divided command="toLogout">{{ t('logout') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </template>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { getLoginState, logout } from '@/apis/login';
const { locale, t } = useI18n();
const store = useStore();

function changeLanguage(lang) {
    locale.value = lang;
    localStorage.setItem('locale', lang);
}
const isLogin = computed(()=>{return store.state.isLogin;});
const username = computed(()=>{return store.state.username;});
const token = computed(()=>{return store.state.token;});
//如果token过期了，需要作废相关信息
if (token) {
    getLoginState().then().catch(()=>{
        store.commit('logout');
        router.push("/login");
    })
}

const unReadCount = ref(0);
const router = useRouter();
const commands = ({
    toPersonal: () => { router.push('/personal') },
    //TODO: 完善退出相关逻辑
    toLogout: () => {
        logout().then(() => {
            store.commit('logout');
            router.push("/login");
        }).catch(error=>{
            console.log(error);
        })
    }
});
function handleCommand(command) {
    commands[command] && commands[command]();
}
</script>

<style lang="scss">
.header-cont {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 100%;

    a {
        color: inherit;
        text-decoration: none;
    }

    h1 {
        margin: 0;
        font-size: 20px;
    }

    .gap {
        margin-right: 20px;
    }

    .right {
        .lang {
            font-size: 14px;

            .item {
                cursor: pointer;

                &.active {
                    font-size: 18px;
                    font-weight: bold;
                }
            }
        }
    }

    .el-dropdown {
        color: inherit;
    }
}
</style>