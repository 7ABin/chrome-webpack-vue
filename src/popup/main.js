import { createApp } from 'vue';
import App from './App.vue';

import 'ant-design-vue/dist/reset.css';
import { message } from 'ant-design-vue';
import antDesignUi from "../utils/ant-design-ui";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";
//app.js
const app = createApp(App);
(function () {
  console.log(antDesignUi,'antDesignUi')
  Object.values(antDesignUi).forEach(item=>{
    app.use(item)
  })
})()
app.mount('#app');
app.config.globalProperties.$message = message;
