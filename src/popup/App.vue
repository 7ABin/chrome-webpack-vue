<template>
  <div class="text-xs min-w-[500px] min-h-[500px] p-2 overflow-auto">
    <a-tabs v-model:active-key="activeKey">
      <a-tab-pane key="1" tab="内容页面">
        <a-space class="mb-1">
          <a-button size="small" type="primary" @click="onGetData" >获取数据</a-button>
          <a-button size="small" type="primary" @click="onCopy" >复制</a-button>
        </a-space>
        <div class="mb-2">
          <a-input  v-model:value="baseServeName" @change="onSetValue" placeholder="服务名称，输入后合并到生成代码上"/>
        </div>
        <Codemirror
            v-if="activeKey==='1'"
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
         <div class="flex justify-items-center">
           设置接口模板:
           <a-tooltip >
             <template #title>
               <span class="text-red-500">注意：</span>
               <div>%xx% 占位符 $xx xx会自动转成小写 #xx 会自动转成大写 比如%$method% 得到结果会是 get post 这种</div>
               <div>
                 title: 接口注释
               </div>
               <div>
                 method: 请求方法
               </div>
               <div>
                 path: 请求地址
               </div>
               <div>
                 baseServeName: 服务名称
               </div>
             </template>
             <ExclamationCircleOutlined class="cursor-pointer ml-2 flex justify-items-center items-center"/>
           </a-tooltip>

         </div>
         <div class="flex-1">
           <div>
             <Codemirror

                 v-model:value="config.template"
                 :options="cmOptions"
                 border
                 placeholder="暂无内容"
                 @change="codeChange"
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
import {ref,getCurrentInstance} from "vue";
import {capitalize, copyText, replacedCode} from "../utils/uitls";
import {useCodeTemplate} from "../hook/codeContent";
import {useSettingConfig} from "../hook/settingConfig";
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';


const { proxy } = getCurrentInstance();
const baseServeName = ref('')

const onSetValue = (e)=>{
  chrome.storage.local.set({baseServeName:e.target.value})
  codeContent.value =replacedCode(config.value.noneBaseTemplate,{baseServeName:baseServeName.value})
}
const onGetData=()=>{
  chrome.runtime.sendMessage({ msg: "giveMeInfo" }, (response) => {
    const {list = []} = response
    let str = config.value.head+'\n'

    for(let item of list){
      let {title,path,method} = item
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
    config.value.noneBaseTemplate = str
    if(baseServeName.value){
      str = replacedCode(str,{baseServeName:baseServeName.value})
    }
    codeContent.value = str
  });
}
const onCopy = ()=>{
  let str = codeContent.value
  // 删除及注释 // 服务名称 输入后会可以控制是否合并到生成代码上
  // str= str?.replace(/^(.*?)\/\/ 服务名称 输入后会可以控制是否合并到生成代码上(.*?)$/gm,'')
  // if(check){
  //   // 寻找baseServeName的值
  //   let baseServeName = str?.match(/%baseServeName=(.*?)%/g)?.[0]?.split('=')?.[1]
  //   baseServeName = baseServeName?.replace(/%/g,'')
  //   // 删除 % % 占位符获取baseServeName
  //   str = str?.replace(/%baseServeName=(.*?)%/g,'')
  //   str = replacedCode(str,{baseServeName})
  //   // 删除多余的空行
  //   str = str.replace(/\n\s*\n+/g, '\n');
  // }else{
  //   let baseServeName = str?.match(/%baseServeName=(.*?)%/g)?.[0]
  //   str = replacedCode(str,{baseServeName})
  //   str = str.replace(/\n\s*\n+/g, '\n');
  // }
  copyText(str).then(()=>{
    proxy.$message?.success('复制成功')
  }).catch(()=>{
    proxy.$message?.error('复制失败')
  })
}
const activeKey =ref('1')

// 设置配置
const {config,onInitConfig,onSave} = useSettingConfig(proxy, onGetData)
// 设置模板
const {codeContent,cmOptions,codeChange} =  useCodeTemplate()

document.addEventListener('DOMContentLoaded', async function() {
  await onInitConfig()
  chrome.storage.local.get('baseServeName').then(res=>{
    baseServeName.value = res.baseServeName
    onGetData()
  })

});
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>
