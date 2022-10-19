declare function getPlatformlApi(): any;
declare function getPlatform(): "wechat" | "douyin" | "alipay" | "red" | "uni" | "unknow";
declare let platformApi: any;

export { getPlatform, getPlatformlApi, platformApi };
