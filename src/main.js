import { createApp } from 'vue'
import App from './App.vue'
import router from './route'
import store from './store'
import i18n from './i18n'
import * as ElIcons from '@element-plus/icons-vue'
import 'normalize.css/normalize.css'
import './mock'

const app = createApp(App);
for(const name in ElIcons){
    app.component(name,ElIcons[name]);
}
app.use(router).use(store).use(i18n).mount('#app')
