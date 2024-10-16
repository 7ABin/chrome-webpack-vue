const listeners = ['yapi.linshimuye.com/api/interface/list_cat','yapi.linshimuye.com/api/interface/list']
// 黑名单监听
const blackList = ['yapi.linshimuye.com/api/interface/list_menu']
let list = []
chrome.webRequest.onCompleted.addListener(
    function(details) {
        const isExtensionRequest = details.initiator?.includes('yapi.linshimuye.com');
        if (details.type === 'xmlhttprequest' && details.statusCode === 200 && isExtensionRequest) {
            let flag = false
            for(let item of listeners){
                const isBlackUrl = blackList.some(item =>details.url.includes(item))
                console.log(isBlackUrl)
                if(isBlackUrl) {
                    flag = false
                    break
                }
                if(details.url.includes(item)){
                    flag = true
                    break
                }
            }
            if(!flag) return;
            fetch(details.url, {credentials: 'include'})
                .then(response => response.json())
                .then(res => {
                    const data = res.data?.list||''
                    if(data){
                        list = data || []
                    }
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