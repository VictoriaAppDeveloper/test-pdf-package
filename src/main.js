import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import { VueHammer } from './plugins/hammer'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

const app = createApp(App)
app.use(PerfectScrollbar)
app.use(VueHammer, {
  threshold: 0,
});
app.mount('#app')
