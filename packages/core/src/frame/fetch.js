// https://github.com/ElemeFE/element/blob/dev/packages/upload/src/ajax.js

function getError(action, option, xhr) {
    const msg = `fail to ${action} ${xhr.status}'`;
    const err = new Error(msg);
    err.status = xhr.status;
    err.url = action;
    return err;
}

function getBody(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

/**
 * @description 获取父窗口的本地存储
 * @param {string} key 本地存储的 key 值
 * @returns {object} 本地存储的 value 值
 */
function getParentLocal(key) {
    try {
        const val = localStorage.getItem(key) || window.parent.localStorage.getItem(key) || '{}';
        return JSON.parse(val);
    } catch (err) {
        console.error('iframe is cross-origin, please set document domain!');
    }
    return {};
}

export const getToken = () => getParentLocal('jwt').value ?? '';
export const getUserInfo = () => getParentLocal('userinfo');


// 自定义扩展 header 请求头
function getConfigHeaders() {
    const {tenantId} = getUserInfo();
    return {
        authorization: `Bearer ${getToken()}`, // token
        QFCTid: tenantId || '', // 租户 ID
        QFCSid: 'CS-0101', // 系统 ID
        lang: localStorage.getItem('lang') || 'zh-cn', // 多语言
        userAgent: 'pc', // 设备
        gray: '0', // 灰度
    };
}

export default function fetch(option) {
    if (typeof XMLHttpRequest === 'undefined') {
        return;
    }

    const xhr = new XMLHttpRequest();
    const action = option.action;

    xhr.onerror = function error(e) {
        option.onError(e);
    };

    xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(action, option, xhr), getBody(xhr));
        }

        option.onSuccess(getBody(xhr));
    };

    xhr.open(option.method || 'get', action, true);

    let formData;
    if (option.data) {
        if ((option.dataType || '').toLowerCase() !== 'json') {
            formData = new FormData();
            Object.keys(option.data).map(key => {
                formData.append(key, option.data[key]);
            });
        } else {
            formData = JSON.stringify(option.data);
            xhr.setRequestHeader('content-type', 'application/json');
        }
    }


    if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
    }
    const optionHeaders = option.headers || {};
    const headers = {
        ...optionHeaders,
        ...getConfigHeaders(),
    };

    Object.keys(headers).forEach(item => {
        if (headers[item] !== null) {
            xhr.setRequestHeader(item, headers[item]);
        }
    });
    xhr.send(formData);
}
