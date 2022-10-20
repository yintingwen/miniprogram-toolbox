export declare const createFailError: (e: any) => any;
export declare function promiseify(api: string, params?: object, ...e: any[]): Promise<any>;
export declare function getApiScope(auth: string): Promise<string>;
export declare function call(api: string, params: object): Promise<any>;
