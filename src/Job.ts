import {URL} from 'url';
import {TaskFunction} from './Cluster';

export type ExecuteResolve = (value?: any) => void;
export type ExecuteReject = (reason?: any) => void;

export type JobData = any;
export type ReturnData = any;

export interface ExecuteCallbacks {
    resolve: (value?: any) => void;
    reject: ExecuteReject;
}

export default class Job<JobData, ReturnData> {

    public data?: JobData;
    public taskFunction: TaskFunction<JobData, ReturnData> | undefined;
    public executeCallbacks: ExecuteCallbacks | undefined;

    private lastError: Error | null = null;
    public tries: number = 0;

    public constructor(
        data?: JobData,
        taskFunction?: TaskFunction<JobData, ReturnData>,
        executeCallbacks?: ExecuteCallbacks,
    ) {
        this.data = data;
        this.taskFunction = taskFunction;
        this.executeCallbacks = executeCallbacks;
    }

    public getProxyURL() {
        if (!this.data) {
            return undefined;
        }
        if (typeof this.data !== 'object') {
            return undefined;
        }

        if (typeof (this.data as any).proxy === 'string') {
            return (this.data as any).proxy;
        }
        return undefined;
    }

    public getUrl(): string | undefined {
        if (!this.data) {
            return undefined;
        }
        if (typeof this.data === 'string') {
            return this.data;
        }
        if (typeof (this.data as any).url === 'string') {
            return (this.data as any).url;
        }
        return undefined;
    }

    public getDomain(): string | undefined {
        // TODO use tld.js to restrict to top-level domain?
        const urlStr = this.getUrl();
        if (urlStr) {
            try {
                const url = new URL(urlStr);
                return url.hostname || undefined;
            } catch (e: any) {
                // if urlStr is not a valid URL this might throw
                // but we leave this to the user
                return undefined;
            }
        }
        return undefined;
    }

    public addError(error: Error): void {
        this.tries += 1;
        this.lastError = error;
    }

}
