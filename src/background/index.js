
// 黑名单监听
// const blackList = ['yapi.linshimuye.com/api/interface/list_menu']
import {listeners} from "../utils/api-listener";

let list = []
chrome.webRequest.onCompleted.addListener(
    function(details) {
        const isExtensionRequest = details.initiator?.includes('yapi.linshimuye.com');
        if (details.type === 'xmlhttprequest' && details.statusCode === 200 && isExtensionRequest) {
            let flag = false
            for(let item in listeners){
                if(details.url.includes(item)){
                    flag = item
                    break
                }
            }
            console.log(flag,'flag565')
            if(!flag) return;
            fetch(details.url, {credentials: 'include'})
                .then(response => response.json())
                .then(res => {
                   const callBack = listeners[flag]
                    list = callBack?.(res)||[]
                }).catch(error => {
                console.error('Error fetching the API response:', error)
            });
        }
    },
    { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msg === "giveMeInfo") {
        sendResponse({ list}); // 返回响应
    }
});