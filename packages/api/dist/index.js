const apiAuthMap = {};
const createFailError = (e) => {
    return { ...e, message: e.errMsg };
};
async function promiseify(api, params, ...e) {
    const targetApi = typeof api === 'string' ? my[api] : api;
    return new Promise((resolve, reject) => {
        targetApi.call(my, {
            ...params,
            success: (e) => {
                if (e.errMsg.split(':')[1] === 'ok') {
                    resolve(e);
                }
                else {
                    reject(createFailError(e));
                }
            },
            fail: (e) => reject(createFailError(e))
        }, ...e);
    });
}
async function getApiScope(auth) {
    promiseify('hideLoading');
    const { confirm } = await promiseify('confirm' , { title: '提示', content: '功能需要开启授权，是否前往设置页开启' });
    if (!confirm)
        return Promise.reject(new Error('model点击取消'));
    const { authSetting } = await promiseify('openSetting');
    return authSetting[auth] ? Promise.resolve('授权成功') : Promise.reject(new Error('取消授权'));
}
async function call(api, params) {
    const scope = apiAuthMap[api];
    if (scope && "alipay" !== "red") {
        const { authSetting } = await promiseify('getSetting', { withSubscriptions: true });
        if (authSetting[scope] === false) {
            await getApiScope(scope);
        }
    }
    return promiseify(api, params);
}

export { call, createFailError, getApiScope, promiseify };
//# sourceMappingURL=index.js.map
