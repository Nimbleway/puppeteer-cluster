"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const util_2 = require("util");
const debug = (0, util_1.debugGenerator)('Worker');
const BROWSER_INSTANCE_TRIES = 10;
class Worker {
    constructor({ cluster, args, id, browser }) {
        this.activeTarget = null;
        this.cluster = cluster;
        this.args = args;
        this.id = id;
        this.browser = browser;
        debug(`Starting #${this.id}`);
    }
    handle(task, job, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            this.activeTarget = job;
            let jobInstance = null;
            let page = null;
            let tries = 0;
            while (jobInstance === null) {
                try {
                    jobInstance = yield this.browser.jobInstance(job);
                    page = jobInstance.resources.page;
                }
                catch (err) {
                    debug(`Error getting browser page (try: ${tries}), message: ${err.message}`);
                    yield this.browser.repair();
                    tries += 1;
                    if (tries >= BROWSER_INSTANCE_TRIES) {
                        throw new Error('Unable to get browser page');
                    }
                }
            }
            // We can be sure that page is set now, otherwise an exception would've been thrown
            page = page; // this is just for TypeScript
            let errorState = null;
            page.on('error', (err) => {
                errorState = err;
                (0, util_1.log)(`Error (page error) crawling ${(0, util_2.inspect)(job.data)} // message: ${err.message}`);
            });
            debug(`Executing task on worker #${this.id} with data: ${(0, util_2.inspect)(job.data)}`);
            let result;
            try {
                result = yield (0, util_1.timeoutExecute)(timeout, task({
                    page,
                    // data might be undefined if queue is only called with a function
                    // we ignore that case, as the user should use Cluster<undefined> in that case
                    // to get correct typings
                    data: job.data,
                    worker: {
                        id: this.id,
                    },
                }));
            }
            catch (err) {
                errorState = err;
                (0, util_1.log)(`Error crawling ${(0, util_2.inspect)(job.data)} // message: ${err.message}`);
            }
            debug(`Finished executing task on worker #${this.id}`);
            try {
                yield jobInstance.close();
            }
            catch (e) {
                debug(`Error closing browser instance for ${(0, util_2.inspect)(job.data)}: ${e.message}`);
                yield this.browser.repair();
            }
            this.activeTarget = null;
            if (errorState) {
                return {
                    type: 'error',
                    error: errorState || new Error('asf'),
                };
            }
            return {
                data: result,
                type: 'success',
            };
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.browser.close();
            }
            catch (err) {
                debug(`Unable to close worker browser. Error message: ${err.message}`);
            }
            debug(`Closed #${this.id}`);
        });
    }
}
exports.default = Worker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1dvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUtBLGlDQUE2RDtBQUM3RCwrQkFBK0I7QUFHL0IsTUFBTSxLQUFLLEdBQUcsSUFBQSxxQkFBYyxFQUFDLFFBQVEsQ0FBQyxDQUFDO0FBU3ZDLE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0FBY2xDLE1BQXFCLE1BQU07SUFTdkIsWUFBbUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQWlCO1FBRmhFLGlCQUFZLEdBQW9DLElBQUksQ0FBQztRQUdqRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXZCLEtBQUssQ0FBQyxhQUFhLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFWSxNQUFNLENBQ1gsSUFBdUMsRUFDdkMsR0FBNkIsRUFDN0IsT0FBZTs7WUFFbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7WUFFeEIsSUFBSSxXQUFXLEdBQXVCLElBQUksQ0FBQztZQUMzQyxJQUFJLElBQUksR0FBZ0IsSUFBSSxDQUFDO1lBRTdCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUVkLE9BQU8sV0FBVyxLQUFLLElBQUksRUFBRTtnQkFDekIsSUFBSTtvQkFDQSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbEQsSUFBSSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2lCQUNyQztnQkFBQyxPQUFPLEdBQVEsRUFBRTtvQkFDZixLQUFL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