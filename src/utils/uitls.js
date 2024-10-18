import {message} from "ant-design-vue";

export const replacedCode = (code,obj) => {
  return code.replace(/%(\w+)%/g, (match, p1) => {
    const toChange = p1.startsWith('$')?'$':p1.startsWith('#')?'#':''
    let key = p1
    if(toChange){
      key= key.splice(1)
    }
    let val = obj[key]
    if(toChange==='$'){
      val = val.toLowerCase()
    }else if(toChange==='#'){
      val = val.toUpperCase()
    }
    return val??match
  });
}
// 转成驼峰
export const  capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
// 复制到剪切板
export const copyText = (text) => {
  return navigator.clipboard.writeText( text)
}
