export const replacedCode = (code,obj) => {
  return code.replace(/%(\w+)%/g, (match, p1) => {
    return obj[p1]
    // const replacement = getReplacementFor(p1); // 假设这是你获取替换值的函数
    // return replacement;
  });

}
// 转成驼峰
export const  capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
// 复制到剪切板
export const copyText = (text) => {
  navigator.clipboard.writeText( text).then(res=>{
    console.log('复制成功')

  }).catch(res=>{
    console.log('复制失败')
  })
}
