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
                            yield (0, util_1.timeoutExecute)(BROWSER_TIMEOUT, page.close());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb25jdXJyZW5jeS9idWlsdC1pbi9Ccm93c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBR0EscUNBQTBEO0FBQzFELDRFQUF1RjtBQUV2RixNQUFNLEtBQUssR0FBRyxJQUFBLHFCQUFjLEVBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUVuRCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFFN0IsTUFBcUIsT0FBNkIsU0FBUSxtQ0FBeUI7SUFDbEUsSUFBSTs4REFBSSxDQUFDO0tBQUE7SUFDVCxLQUFLOzhEQUFJLENBQUM7S0FBQTtJQUVWLGNBQWMsQ0FBQyxpQkFBc0Q7O1lBRzlFLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDbEQsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQXNCLENBQUM7WUFDdkUsSUFBSSxJQUFvQixDQUFDO1lBQ3pCLElBQUksT0FBWSxDQUFDLENBQUMsK0JBQStCO1lBRWpELE9BQU87Z0JBQ0gsV0FBVyxFQUFFLENBQU8sR0FBeUMsRUFBRSxFQUFFO29CQUM3RCxNQUFNLElBQUEscUJBQWMsRUFBQyxlQUFlLEVBQUUsQ0FBQyxHQUFTLEVBQUU7d0JBQzlDLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQzs0QkFDakQsV0FBVyxFQUFFLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxXQUFXLEVBQUU7eUJBQ2xDLENBQUMsQ0FBQzt3QkFDSCxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ25DLENBQUMsQ0FBQSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUVOLE9BQU87d0JBQ0gsU0FBUyxFQUFFOzRCQUNQLE9BQU87NEJBQ1AsSUFBSTt5QkFDUDt3QkFFRCxLQUFLLEVBQUUsR0FBUyxFQUFFOzRCQUNkLE1BQU0sSUFBQSxxQkFBYyxFQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzs0QkFDcEQsTUFBTSxJQUFBLHFCQUFjLEVBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUMzRCxDQUFDLENBQUE7cUJBQ0osQ0FBQztnQkFDTixDQUFDLENBQUE7Z0JBRUQsS0FBSyxFQUFFLEdBQVMsRUFBRTtvQkFDZCxNQUFNLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDekIsQ0FBQyxDQUFBO2dCQUVELE1BQU0sRUFBRSxHQUFTLEVBQUU7O29CQUNmLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO29CQUN6QixJQUFJLFVBQThCLENBQUM7b0JBRW5DLElBQUk7d0JBQ0EsVUFBVSxHQUFHLE1BQUEsTUFBTSxDQUFDLE9BQU8sRUFBRSwwQ0FBRSxHQUFHLENBQUM7d0JBQ25DLG9FQUFvRTt3QkFDcEUsTUFBTSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ3hCO29CQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUU7b0JBRWQsSUFBSTt3QkFDQSxJQUFHLFVBQVU7NEJBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztxQkFDM0M7b0JBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRTtvQkFFZCxzREFBc0Q7b0JBQ3RELE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNsRCxDQUFDLENBQUE7YUFDSixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRUQsY0FBYyxLQUFVLENBQUM7Q0FFNUI7QUE1REQsMEJBNERDIn0=