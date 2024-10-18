// export const  listeners = [
//     'yapi.linshimuye.com/api/interface/list_cat',
//     'yapi.linshimuye.com/api/interface/get'
// ]
export const listeners={
    'yapi.linshimuye.com/api/interface/list_cat':(res)=>{
        return  res.data?.list || []
    },
    'yapi.linshimuye.com/api/interface/get':(res)=>{
        return [res.data]
    }
}