import {ref} from "vue";
import {initContent, initHead} from "../utils/template";

export const useSettingConfig = (proxy,onGetData)=>{
    const config = ref({
        head:'',
        template:''
    })
    const onInitConfig = async ()=>{
        let defaultConfig = await chrome.storage.local.get('config')
        defaultConfig = defaultConfig.config?JSON.parse(defaultConfig.config):{}
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