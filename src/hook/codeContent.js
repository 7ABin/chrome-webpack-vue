import {ref} from "vue";

export const  useCodeTemplate = ()=>{
    const codeContent = ref('')
    const cmOptions = {
        mode: "text/javascript", // Language mode
        theme: "ayu-dark", // Theme
    }
    const codeChange = (e)=>{
        console.log(e)
    }
    return {
        codeContent,
        cmOptions,
        codeChange
    }
}