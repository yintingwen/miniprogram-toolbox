declare const tt: any
declare const my: any
declare const xhs: any
declare const uni: any
declare const wx: any


export function getPlatformlApi () {
  return wx || tt || my || xhs || uni
}

export function getPlatform () {
  switch (true) {
    case (!!wx): {
      return 'wechat'
    }
    case (!!tt): {
      return 'douyin'
    }
    case (!!my): {
      return 'alipay'
    }
    case (!!xhs): {
      return 'red'
    }
    case (!!uni): {
      return 'uni'
    }
    default: {
      return 'unknow'
    }
  }
}

export let platformApi = getPlatformlApi()
