import * as puppeteer from 'puppeteer';
import ConcurrencyImplementation, { ResourceData } from './ConcurrencyImplementation';
import Job, { JobData, ReturnData } from '../Job';
export default abstract class SingleBrowserImplementation extends ConcurrencyImplementation {
    protected browser: puppeteer.Browser | null;
    private repairing;
    private repairRequested;
    private openInstances;
    private waitingForRepairResolvers;
    constructor(options: puppeteer.LaunchOptions, puppeteer: any);
    private repair;
    init(): Promise<void>;
    close(): Promise<void>;
    protected abstract createResources(): Promise<ResourceData>;
    protected abstract freeResources(resources: ResourceData): Promise<void>;
    requestRestart(): void;
    workerInstance(): Promise<{
        jobInstance: (job: Job<JobData, ReturnData> | undefined) => Promise<{
            resources: ResourceData;
            close: () => Promise<void>;
        }>;
        close: () => Promise<void>;
        repair: () => Promise<void>;
    }>;
}
