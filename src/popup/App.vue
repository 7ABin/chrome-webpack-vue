<template>
  <div class="text-xs min-w-[500px] min-h-[500px] p-2 overflow-auto">
    <a-tabs>
      <a-tab-pane key="1" tab="内容页面">
        <a-space class="mb-1">
          <a-button size="small" type="primary" @click="onGetData" >获取数据</a-button>
          <a-button size="small" type="primary" @click="onCopy" >复制</a-button>
<!--          <div>-->
<!--            是否将服务名称合并到 接口名称:-->
<!--            <a-switch v-model:checked="check" checked-children="开" un-checked-children="关" />-->
<!--          </div>-->

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
      <a-space >
        <a-button size="small" type="primary" @click="onSave" >保存</a-button>
      </a-space>
       <div >
         <div>
           设置表头模板:
         </div>
         <div>
           <div>
             <Codemirror
                 v-model:value="config.head"
                 :options="cmOptions"
                 border
                 placeholder="暂无内容"
                 :height="120"
             />
           </div>
         </div>
       </div>
       <div>
         <div >
           设置接口模板:
         </div>
         <div class="flex-1">
           <div>
             <Codemirror
                 v-model:value="config.template"
                 :options="cmOptions"
                 border
                 placeholder="暂无内容"
                 :height="150"
             />
           </div>
         </div>
       </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup name="App">
import Codemirror from "codemirror-editor-vue3";
import "codemirror/addon/display/placeholder.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/display/placeholder.js";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/ayu-dark.css";
import {baseServeName, initContent, initHead} from "../utils/template";
import {ref,reactive,getCurrentInstance} from "vue";
import {capitalize, copyText, replacedCode} from "../utils/uitls";

const codeContent = ref('')
const cmOptions = {
    mode: "text/javascript", // Language mode
    theme: "ayu-dark", // Theme
}


const { proxy } = getCurrentInstance();
const onGetData=()=>{
  chrome.runtime.sendMessage({ msg: "giveMeInfo" }, (response) => {
    const {list = []} = response
    let str = config.value.head+'\n'
    str += `// 服务名称 输入后合并到生成代码上
    %baseServeName=${baseServeName}%`+'\n'
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
      name = 'api'+name
      str += replacedCode(config.value.template,{title,path,method,apiName:name})
    }
    codeContent.value = str
  });
}
const onCopy = ()=>{
  let str = codeContent.value
  // 删除及注释 // 服务名称 输入后会可以控制是否合并到生成代码上
  str= str?.replace(/^(.*?)\/\/ 服务名称 输入后会可以控制是否合并到生成代码上(.*?)$/gm,'')
  if(check){
    // 寻找baseServeName的值
    let baseServeName = str?.match(/%baseServeName=(.*?)%/g)?.[0]?.split('=')?.[1]
    baseServeName = baseServeName?.replace(/%/g,'')
    // 删除 % % 占位符获取baseServeName
    str = str?.replace(/%baseServeName=(.*?)%/g,'')
    str = replacedCode(str,{baseServeName})
    // 删除多余的空行
    str = str.replace(/\n\s*\n+/g, '\n');
  }else{
    let baseServeName = str?.match(/%baseServeName=(.*?)%/g)?.[0]
    str = replacedCode(str,{baseServeName})
    str = str.replace(/\n\s*\n+/g, '\n');
  }
  copyText(str).then(()=>{
    proxy.$message?.success('复制成功')
  }).catch(()=>{
    proxy.$message?.error('复制失败')
  })
}

const check = ref(true)

// 设置配置
const useSettingConfig = ()=>{
  const config = ref({
    head:'',
    template:''
  })
   const onInitConfig = async ()=>{
    let defaultConfig = await chrome.storage.local.get('config')
     console.log(defaultConfig)
     defaultConfig = defaultConfig.config?JSON.parse(defaultConfig.config):{}
     console.log(defaultConfig,'123')
    if(defaultConfig&&Object.keys(defaultConfig).length>0){
      config.value =defaultConfig
    }else{
      config.value.head = initHead
      config.value.template = initContent
    }
  }
  // 保存
  const onSave = ()=>{
    chrome.storage.local.set({config:JSON.stringify(config.value)}).then(res=>{
      onGetData()
      proxy.$message?.success('保存成功')
    })
  }
  return {
    config,
    onInitConfig,
    onSave
  }
}
const {config,onInitConfig,onSave} = useSettingConfig()
document.addEventListener('DOMContentLoaded', async function() {
  await onInitConfig()
  onGetData()
});
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
