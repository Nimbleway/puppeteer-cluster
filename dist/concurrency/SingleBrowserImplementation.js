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
const ConcurrencyImplementation_1 = require("./ConcurrencyImplementation");
const util_1 = require("../util");
const debug = (0, util_1.debugGenerator)('SingleBrowserImpl');
const BROWSER_TIMEOUT = 5000;
class SingleBrowserImplementation extends ConcurrencyImplementation_1.default {
    constructor(options, puppeteer) {
        super(options, puppeteer);
        this.browser = null;
        this.repairing = false;
        this.repairRequested = false;
        this.openInstances = 0;
        this.waitingForRepairResolvers = [];
    }
    repair() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.openInstances !== 0 || this.repairing) {
                // already repairing or there are still pages open? wait for start/finish
                yield new Promise(resolve => this.waitingForRepairResolvers.push(resolve));
                return;
            }
            this.repairing = true;
            debug('Starting repair');
            try {
                // will probably fail, but just in case the repair was not necessary
                yield this.browser.close();
            }
            catch (e) {
                debug('Unable to close browser.');
            }
            try {
                this.browser = (yield this.puppeteer.launch(this.options));
            }
            catch (err) {
                throw new Error('Unable to restart chrome.');
            }
            this.repairRequested = false;
            this.repairing = false;
            this.waitingForRepairResolvers.forEach(resolve => resolve());
            this.waitingForRepairResolvers = [];
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield this.puppeteer.launch(this.options);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.browser.close();
        });
    }
    requestRestart() {
        this.repairRequested = true;
    }
    workerInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            let resources;
            return {
                jobInstance: () => __awaiter(this, void 0, void 0, function* () {
                    if (this.repairRequested) {
                        yield this.repair();
                    }
                    yield (0, util_1.timeoutExecute)(BROWSER_TIMEOUT, (() => __awaiter(this, void 0, void 0, function* () {
                        resources = yield this.createResources();
                    }))());
                    this.openInstances += 1;
                    return {
                        resources,
                        close: () => __awaiter(this, void 0, void 0, function* () {
                            this.openInstances -= 1; // decrement first in case of error
                            yield (0, util_1.timeoutExecute)(BROWSER_TIMEOUT, this.freeResources(resources));
                            if (this.repairRequested) {
                                yield this.repair();
                            }
                        }),
                    };
                }),
                close: () => __awaiter(this, void 0, void 0, function* () { }),
                repair: () => __awaiter(this, void 0, void 0, function* () {
                    debug('Repair requested');
                    this.repairRequested = true;
                    yield this.repair();
                }),
            };
        });
    }
}
exports.default = SingleBrowserImplementation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2luZ2xlQnJvd3NlckltcGxlbWVudGF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmN1cnJlbmN5L1NpbmdsZUJyb3dzZXJJbXBsZW1lbnRhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLDJFQUFvRjtBQUVwRixrQ0FBdUQ7QUFFdkQsTUFBTSxLQUFLLEdBQUcsSUFBQSxxQkFBYyxFQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFbEQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBRTdCLE1BQThCLDJCQUE0QixTQUFRLG1DQUF5QjtJQVN2RixZQUFtQixPQUFnQyxFQUFFLFNBQWM7UUFDL0QsS0FBSyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQVJwQixZQUFPLEdBQTZCLElBQUksQ0FBQztRQUUzQyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBQ2pDLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLDhCQUF5QixHQUFtQixFQUFFLENBQUM7SUFJdkQsQ0FBQztJQUVhLE1BQU07O1lBQ2hCLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDNUMseUVBQXlFO2dCQUN6RSxNQUFNLElBQUksT0FBTyxDQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNqRixPQUFPO2FBQ1Y7WUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUV6QixJQUFJO2dCQUNBLG9FQUFvRTtnQkFDcEUsTUFBMEIsSUFBSSxDQUFDLE9BQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNuRDtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNS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