<template>
  <div class="text-xs min-w-[500px] min-h-[500px] p-2 overflow-auto">
    <a-tabs>
      <a-tab-pane key="1" tab="内容页面">
        <a-space class="mb-1">
          <a-button size="small" type="primary" @click="onGetData" >获取数据</a-button>
          <a-button size="small" type="primary" @click="onCopy" >复制</a-button>
        </a-space>

        <Codemirror
            v-model:value="codeContent"
            :options="cmOptions"
            border
            placeholder="暂无内容"
            :height="400"
        />
      </a-tab-pane>
      <a-tab-pane key="2" tab="设置">
        <div></div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup name="App">
import Codemirror from "codemirror-editor-vue3";
import "codemirror/addon/display/placeholder.js";
// language
import "codemirror/mode/javascript/javascript.js";
// placeholder
import "codemirror/addon/display/placeholder.js";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/ayu-dark.css";
import {initContent, initHead} from "../utils/template";
import {ref} from "vue";
import {capitalize, copyText, replacedCode} from "../utils/uitls";
const codeContent = ref('')
const cmOptions = {
    mode: "text/javascript", // Language mode
    theme: "ayu-dark", // Theme
}
const onGetData=()=>{
  chrome.runtime.sendMessage({ msg: "giveMeInfo" }, (response) => {
    const {list = []} = response
    let str = initHead+'\n'
    for(let item of list){
      const {title,path,method} = item
      let  name = path?.split('/')
      if(name&&name.length>1){
        name = name.slice(name.length-2)
        let [secondLase,last] = name
        secondLase = capitalize(secondLase)
        last = capitalize(last)
        name = secondLase+last
      }
      str += replacedCode(initContent,{title,path,method,val:name})
    }
    console.log(str,'str')
    codeContent.value = str

  });
}
const onCopy = ()=>{
  console.log(codeContent.value)
  copyText(codeContent.value)
}

document.addEventListener('DOMContentLoaded', function() {
  onGetData()
});


</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
