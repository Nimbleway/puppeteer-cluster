import * as puppeteer from 'puppeteer';
import ConcurrencyImplementation, { WorkerInstance } from '../ConcurrencyImplementation';
export default class Browser<JobData, ReturnData> extends ConcurrencyImplementation {
    init(): Promise<void>;
    close(): Promise<void>;
    workerInstance(perBrowserOptions: puppeteer.LaunchOptions | undefined): Promise<WorkerInstance>;
    requestRestart(): void;
}
