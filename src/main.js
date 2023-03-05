import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './route'
import store from './store'
import * as ElIcons from '@element-plus/icons-vue'
const app = createApp(App);
for(const name in ElIcons){
    app.component(name,ElIcons[name]);
}
app.use(router).use(store).mount('#app')
