import * as puppeteer from 'puppeteer';
import Job from '../../Job';

import {debugGenerator, timeoutExecute} from '../../util';
import ConcurrencyImplementation, {WorkerInstance} from '../ConcurrencyImplementation';

const debug = debugGenerator('BrowserConcurrency');

const BROWSER_TIMEOUT = 5000;

export default class Browser<JobData, ReturnData> extends ConcurrencyImplementation {
    public async init() {}
    public async close() {}

    public async workerInstance(perBrowserOptions: puppeteer.LaunchOptions | undefined):
        Promise<WorkerInstance> {

        const options = perBrowserOptions || this.options;
        let chrome = await this.puppeteer.launch(options) as puppeteer.Browser;
        let page: puppeteer.Page;
        let context: any; // puppeteer typings are old...

        return {
            jobInstance: async (job: Job<JobData, ReturnData> | undefined) => {
                await timeoutExecute(BROWSER_TIMEOUT, (async () => {
                    context = await chrome.createIncognitoBrowserContext({
                        proxyServer: job?.getProxyURL()
                    });
                    page = await context.newPage();
                })());

                return {
                    resources: {
                        context,
                        page,
                    },

                    close: async () => {
                        await timeoutExecute(BROWSER_TIMEOUT, page.close());
                        await timeoutExecute(BROWSER_TIMEOUT, context.close());
                    },
                };
            },

            close: async () => {
                await chrome.close();
            },

            repair: async () => {
                debug('Starting repair');
                let browserPID: number | undefined;

                try {
                    browserPID = chrome.process()?.pid;
                    // will probably fail, but just in case the repair was not necessary
                    await chrome.close();
                } catch (e) {}
                
                try {
                    if(browserPID) process.kill(browserPID);
                } catch (e) {}

                // just relaunch as there is only one page per browser
                chrome = await this.puppeteer.launch(options);
            },
        };
    }

    requestRestart(): void {}
    
}
