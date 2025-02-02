import { TaskFunction } from './Cluster';
export declare type ExecuteResolve = (value?: any) => void;
export declare type ExecuteReject = (reason?: any) => void;
export declare type JobData = any;
export declare type ReturnData = any;
export interface ExecuteCallbacks {
    resolve: (value?: any) => void;
    reject: ExecuteReject;
}
export default class Job<JobData, ReturnData> {
    data?: JobData;
    taskFunction: TaskFunction<JobData, ReturnData> | undefined;
    executeCallbacks: ExecuteCallbacks | undefined;
    private lastError;
    tries: number;
    constructor(data?: JobData, taskFunction?: TaskFunction<JobData, ReturnData>, executeCallbacks?: ExecuteCallbacks);
    getProxyURL(): any;
    getUrl(): string | undefined;
    getDomain(): string | undefined;
    addError(error: Error): void;
}
