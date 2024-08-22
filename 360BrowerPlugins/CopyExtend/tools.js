
if (window.load_popup_js_loaded) {
}
else {
    //"Extension cp2cp loaded successfully";
    window.load_popup_js_loaded = true;
    const hadleObject = {
        textareaId: 'textarea_copy',
        getTextAreaElement: function () {
            return document.getElementById(hadleObject.textareaId);
        },
        setTextArea: function (text) {
            hadleObject.getTextAreaElement().textContent = text;
            try {
                hadleObject.getTextAreaElement().focus();
                navigator.clipboard.writeText(text).then(function (res) {
                    console.log(res);
                }, function (err) {
                    console.log(err);
                });
            } catch (error) {
                console.log(error);
            }
        },
    };

    const communicateObject = {
        // 获取tabId
        FetchCurrentTabId: function () {
            return new Promise((resolve, reject) => {
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function (results) {
                    resolve(results.length > 0 ? results[0].id : null);
                });
            });
        },
        // 发送信息返回
        backSendMessage: function (message) {
        },
        sendMessage: function (message, callback) {
            // 扩展背景发送信息需要tabId
            communicateObject.FetchCurrentTabId().then(function (tabId) {
                chrome.tabs.sendMessage(tabId, message, callback);
            });
        },
        // 接收界面信息
        handleMessage: function (request, sender, sendResponse) {
            if (request.type === "ui_message") {
                hadleObject.setTextArea(request.info);
                sendResponse({ response: "Back: get message from ui" });
            }
        },
        timecallback: function (){
            communicateObject.sendMessage("Cmd:getClipboardTxt", communicateObject.backSendMessage);
        },
        init: function () {
            setTimeout(communicateObject.timecallback, 500);
        }
    };

    chrome.windows.getCurrent(function (currentWindow) {
        //获取有指定属性的标签，为空获取全部标签
        chrome.tabs.query({
            active: true, windowId: currentWindow.id
        }, function (activeTabs) {
            if (activeTabs[0].id) {
                if (!window.token) {
                    window.token = 0;
                } else {
                    console.log("TabId:" + activeTabs[0].id);
                }
                chrome.scripting.executeScript({
                    target: { tabId: activeTabs[0].id },
                    function: (token) => {
                        // This code runs in the context of the page
                        window.token = token;
                    },
                    args: [window.token],
                }, () => {
                    // This code runs after the script has been executed
                    chrome.scripting.executeScript({
                        target: { tabId: activeTabs[0].id },
                        files: ['scripts/content.js'],
                    });
                });
            }
        });
    });

    let btnCopyElement = document.getElementById('btn_copy');
    let switchOpen = false;
    btnCopyElement.onclick = function () {
        communicateObject.sendMessage("Cmd:getClipboardTxt", communicateObject.backSendMessage);
    };


    // 监听消息传递
    if (chrome.runtime && chrome.runtime.onMessage
        && chrome.runtime.onMessage.addListener) {
        chrome.runtime.onMessage.addListener(communicateObject.handleMessage);
    }

    
    communicateObject.init();
}
