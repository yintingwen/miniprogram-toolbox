export declare function registerApiScope(e: Record<string, string>): void;
export declare const createFailError: (e: any) => any;
export declare function promiseify(api: keyof typeof wx, params?: object, ...e: any[]): Promise<any>;
export declare function getApiScope(auth: string): Promise<string>;
export declare function call(api: keyof typeof wx, params: object): Promise<any>;
