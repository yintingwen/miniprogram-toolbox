const apiScopeMap: Record<string, string> = {}

export function registerApiScope (e: Record<keyof typeof PLATFORM_API, string>) {
  Object.assign(apiScopeMap, e)
}

export const createFailError = (e: any) => {
  return { ...e, message: e.errMsg }
}

export async function promiseify  (api: keyof typeof PLATFORM_API, params?: object, ...e: any[]): Promise<any> {
    const targetApi = typeof api === 'string' ? PLATFORM_API[api] : api
    return new Promise((resolve, reject) => {
        targetApi.call(PLATFORM_API, {
            ...params,
            success: (e: any) => {
              if (e.errMsg.split(':')[1] === 'ok') {
                resolve(e)
              } else {
                reject(createFailError(e))
              }
            },
            fail: (e: any) =>  reject(createFailError(e))
        }, ...e)
    })
}

export async function getApiScope (auth: string) {
  promiseify('hideLoading')
  const { confirm } = await promiseify(PLATFORM === 'alipay' ? 'confirm' : 'showModal', { title: '提示', content: '功能需要开启授权，是否前往设置页开启' })
  if ( !confirm ) return Promise.reject(new Error('model点击取消')) 
  const { authSetting } = await promiseify('openSetting')
  return authSetting[auth] ? Promise.resolve('授权成功') : Promise.reject(new Error('取消授权'))
}

export async function call (api: keyof typeof PLATFORM_API, params: object) {
  const scope = apiScopeMap[api]
  if (scope && PLATFORM !== "xhs") {
    const { authSetting } = await promiseify('getSetting', { withSubscriptions: true })
    if (authSetting[scope] === false) {
      await getApiScope(scope)
    }
  }
  return promiseify(api, params)
}
