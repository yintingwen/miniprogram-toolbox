declare const apiAuthMap: Record<string, string>;
declare const createFailError: (e: any) => any;
declare function promiseify(api: string, params?: object, ...e: any[]): Promise<any>;
declare function getApiScope(auth: string): Promise<string>;
/**
 *
 * @param {keyof wx} api
 * @param {*} params
 */
declare function call(api: string, params: object): Promise<any>;

export { apiAuthMap, call, createFailError, getApiScope, promiseify };
