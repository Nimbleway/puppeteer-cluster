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
const util_1 = require("../../util");
const ConcurrencyImplementation_1 = require("../ConcurrencyImplementation");
const debug = (0, util_1.debugGenerator)('BrowserConcurrency');
const BROWSER_TIMEOUT = 5000;
class Browser extends ConcurrencyImplementation_1.default {
    init() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    workerInstance(perBrowserOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = perBrowserOptions || this.options;
            let chrome = yield this.puppeteer.launch(options);
            let page;
            let context; // puppeteer typings are old...
            return {
                jobInstance: (job) => __awaiter(this, void 0, void 0, function* () {
                    yield (0, util_1.timeoutExecute)(BROWSER_TIMEOUT, (() => __awaiter(this, void 0, void 0, function* () {
                        context = yield chrome.createIncognitoBrowserContext({
                            proxyServer: job === null || job === void 0 ? void 0 : job.getProxyURL()
                        });
                        page = yield context.newPage();
                    }))());
                    return {
                        resources: {
                            context,
                            page,
                        },
                        close: () => __awaiter(this, void 0, void 0, function* () {
                            yield (0, util_1.timeoutExecute)(BROWSER_TIMEOUT, context.close());
                        }),
                    };
                }),
                close: () => __awaiter(this, void 0, void 0, function* () {
                    yield chrome.close();
                }),
                repair: () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    debug('Starting repair');
                    let browserPID;
                    try {
                        browserPID = (_a = chrome.process()) === null || _a === void 0 ? void 0 : _a.pid;
                        // will probably fail, but just in case the repair was not necessary
                        yield chrome.close();
                    }
                    catch (e) { }
                    try {
                        if (browserPID)
                            process.kill(browserPID);
                    }
                    catch (e) { }
                    // just relaunch as there is only one page per browser
                    chrome = yield this.puppeteer.launch(options);
                }),
            };
        });
    }
    requestRestart() { }
}
exports.default = Browser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb25jdXJyZW5jeS9idWlsdC1pbi9Ccm93c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBR0EscUNBQTBEO0FBQzFELDRFQUF1RjtBQUV2RixNQUFNLEtBQUssR0FBRyxJQUFBLHFCQUFjLEVBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUVuRCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFFN0IsTUFBcUIsT0FBNkIsU0FBUSxtQ0FBeUI7SUFDbEUsSUFBSTs4REFBSSxDQUFDO0tBQUE7SUFDVCxLQUFLOzhEQUFJLENBQUM7S0FBQTtJQUVWLGNBQWMsQ0FBQyxpQkFBc0Q7O1lBRzlFLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDbEQsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQXNCLENBQUM7WUFDdkUsSUFBSSxJQUFvQixDQUFDO1lBQ3pCLElBQUksT0FBWSxDQUFDLENBQUMsK0JBQStCO1lBRWpELE9BQU87Z0JBQ0gsV0FBVyxFQUFFLENBQU8sR0FBeUMsRUFBRSxFQUFFO29CQUM3RCxNQUFNLElBQUEscUJBQWMsRUFBQyxlQUFlLEVBQUUsQ0FBQyxHQUFTLEVBQUU7d0JBQzlDLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQzs0QkFDakQsV0FBVyxFQUFFLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxXQUFXLEVBQUU7eUJBQ2xDLENBQUMsQ0FBQzt3QkFDSCxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ25DLENBQUMsQ0FBQSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUVOLE9BQU87d0JBQ0gsU0FBUyxFQUFFOzRCQUNQLE9BQU87NEJBQ1AsSUFBSTt5QkFDUDt3QkFFRCxLQUFLLEVBQUUsR0FBUyxFQUFFOzRCQUNkLE1BQU0sSUFBQSxxQkFBYyxFQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzt3QkFDM0QsQ0FBQyxDQUFBO3FCQUNKLENBQUM7Z0JBQ04sQ0FBQyxDQUFBO2dCQUVELEtBQUssRUFBRSxHQUFTLEVBQUU7b0JBQ2QsTUFBTSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3pCLENBQUMsQ0FBQTtnQkFFRCxNQUFNLEVBQUUsR0FBUyxFQUFFOztvQkFDZixLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFDekIsSUFBSSxVQUE4QixDQUFDO29CQUVuQyxJQUFJO3dCQUNBLFVBQVUsR0FBRyxNQUFBLE1BQU0sQ0FBQyxPQUFPLEVBQUUsMENBQUUsR0FBRyxDQUFDO3dCQUNuQyxvRUFBb0U7d0JBQ3BFLE1BQU0sTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO3FCQUN4QjtvQkFBQyxPQUFPLENBQUMsRUFBRSxHQUFFO29CQUVkLElBQUk7d0JBQ0EsSUFBRyxVQUFVOzRCQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7cUJBQzNDO29CQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUU7b0JBRWQsc0RBQXNEO29CQUN0RCxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbEQsQ0FBQyxDQUFBO2FBQ0osQ0FBQztRQUNOLENBQUM7S0FBQTtJQUVELGNBQWMsS0FBVSxDQUFDO0NBRTVCO0FBM0RELDBCQTJEQyJ9