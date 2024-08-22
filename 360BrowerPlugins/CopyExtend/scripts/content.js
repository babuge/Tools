if (Window.chrome_extension_cp2cp_loaded) {
}
else {
    Window.chrome_extension_cp2cp_loaded = true;
    console.log("Extension_cp2cp_loaded!\n");
    // 扩展与界面通信
    const communicateObjec = {
        // 发送信息回调
        backSendMessage: function (message) {
            // backSendMessage
        },
        // 向扩展发信息
        sendMessage: function (extrendIdString, message, options, callback) {
            chrome.runtime.sendMessage({
                info: message,
                type: "ui_message"
            }, callback);
        },
        // 接收扩展消息
        responseMessage: function (request, sender, sendResponse) {
            sendResponse("Back:UI GetMessage");
            if (request === "Cmd:getClipboardTxt") {
                asyncObjec.DoEvent();
            }
        }
    };

    // 操作
    const handelObjec = {
        // 剪贴板操作
        promiseCopy: function () {
            try {
                let selection = window.getSelection();
                if (!selection || selection.toString().length === 0) {
                    return "";
                }
                let SelectText = selection.toString();
                if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                    document.getElementsByTagName("Body")[0].focus();
                    navigator.clipboard.writeText(SelectText).then(function (res) {
                        //console.log(res);
                    }, function (err) {
                        //console.log(err);
                    });
                }
                if (SelectText.length) {
                    return SelectText;
                }
            } catch (e) {
                //throw Error(e);
            }
            //throw Error();
            return "";
        }
    };

    // 异步事件
    const asyncObjec = {
        // 异步处理 操作
        FetchDataAsync: async function () {
            let response = await handelObjec.promiseCopy();
            return response;
        },
        // 异步结果true
        ResolveReturn: function (data) {
            if (data === "") {
                return;
            }
            try {
                communicateObjec.sendMessage("", data, {}, communicateObjec.backSendMessage);
            } catch (error) {

            }
        },
        // 异步结果false
        RejectReturn: function (data) {
        },
        DoEvent: function () {
            asyncObjec.FetchDataAsync().then(asyncObjec.ResolveReturn, asyncObjec.RejectReturn);
        }
    };

    if (chrome && chrome.runtime
        && chrome.runtime.onMessage
        && chrome.runtime.onMessage.addListener) {
        chrome.runtime.onMessage.addListener(communicateObjec.responseMessage);
    }

    let keydown_list = [{ key: "", value: 0 }, { key: "", value: 0 }];
    window.addEventListener("keydown", ((e) => {

        let time = new Date().getTime() / 1000;
        let copyEvent = false;

        if (e.type === "keydown") {
            let item = { key: "", value: 0 };
            const itemCnst = { key: "", value: 0 };
            if (e.key === "Control") {
                item.key = e.key;
                item.value = time;
                keydown_list[0] = item;
            }
            else if (e.key === "c" || e.key === "C") {
                if (keydown_list[0].key != "Control"
                    || time - keydown_list[0].value > 5
                ) {
                    keydown_list[0] = itemCnst;
                    keydown_list[1] = itemCnst;
                }
                else {
                    keydown_list[0].value = time;
                    item.key = e.key;
                    item.value = time;
                    keydown_list[1] = item;
                    copyEvent = true;
                }
            }
            else {
                keydown_list[0] = itemCnst;
                keydown_list[1] = itemCnst;
            }
        }

        if (copyEvent) {
            // 不重置 copykeylist，连续拷贝
            // 执行异步操作获取copy 文本
            asyncObjec.DoEvent();
        }

    }), false);

}