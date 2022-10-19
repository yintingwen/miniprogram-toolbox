// packages/shared/dist/index.js
function getPlatformlApi() {
  return wx || tt || my || xhs || uni;
}
function getPlatform() {
  switch (true) {
    case !!wx: {
      return "wechat";
    }
    case !!tt: {
      return "douyin";
    }
    case !!my: {
      return "alipay";
    }
    case !!xhs: {
      return "red";
    }
    case !!uni: {
      return "uni";
    }
    default: {
      return "unknow";
    }
  }
}
var platformApi = getPlatformlApi();

// packages/api/src/index.ts
var apiAuthMap = {
  saveImageToPhotosAlbum: "scope.writePhotosAlbum",
  startRecord: "scope.record"
};
var createFailError = (e) => {
  return { ...e, message: e.errMsg };
};
async function promiseify(api, params, ...e) {
  const targetApi = typeof api === "string" ? platformApi[api] : api;
  return new Promise((resolve, reject) => {
    targetApi.call(platformApi, {
      ...params,
      success: (e2) => {
        if (e2.errMsg.split(":")[1] === "ok") {
          resolve(e2);
        } else {
          reject(createFailError(e2));
        }
      },
      fail: (e2) => reject(createFailError(e2))
    }, ...e);
  });
}
async function getApiScope(auth) {
  promiseify("hideLoading");
  const { confirm } = await promiseify("showModal", { title: "\u63D0\u793A", content: "\u529F\u80FD\u9700\u8981\u5F00\u542F\u6388\u6743\uFF0C\u662F\u5426\u524D\u5F80\u8BBE\u7F6E\u9875\u5F00\u542F" });
  if (!confirm)
    return Promise.reject(new Error("model\u70B9\u51FB\u53D6\u6D88"));
  const { authSetting } = await promiseify("openSetting");
  return authSetting[auth] ? Promise.resolve("\u6388\u6743\u6210\u529F") : Promise.reject(new Error("\u53D6\u6D88\u6388\u6743"));
}
async function call(api, params) {
  const scope = apiAuthMap[api];
  if (scope && getPlatform() !== "red") {
    const { authSetting } = await promiseify("getSetting", { withSubscriptions: true });
    if (authSetting[scope] === false) {
      await getApiScope(scope);
    }
  }
  return promiseify(api, params);
}
export {
  apiAuthMap,
  call,
  createFailError,
  getApiScope,
  promiseify
};
