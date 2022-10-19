// packages/shared/index.ts
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
export {
  getPlatform,
  getPlatformlApi,
  platformApi
};
