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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppCenterBuildMonitor = void 0;
var axios_1 = __importDefault(require("axios"));
var AppCenterBuildMonitor = /** @class */ (function () {
    function AppCenterBuildMonitor(appName, ownerName, token) {
        var _this = this;
        this.appName = appName;
        this.ownerName = ownerName;
        //send request to AppCenter Api using axios
        this.getBuildById = function (buildId) { return __awaiter(_this, void 0, void 0, function () {
            var response, build;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apiClient.get("/builds/" + buildId)];
                    case 1:
                        response = _a.sent();
                        build = response.data;
                        return [2 /*return*/, build];
                }
            });
        }); };
        this.getBranches = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, branches;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apiClient.get("/branches")];
                    case 1:
                        response = _a.sent();
                        branches = response.data;
                        return [2 /*return*/, branches || []];
                }
            });
        }); };
        this.startBuild = function (branchName, sourceVersion) { return __awaiter(_this, void 0, void 0, function () {
            var params, response, build;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = { sourceVersion: sourceVersion };
                        return [4 /*yield*/, this.apiClient.post("/branches/" + branchName + "/builds", params)];
                    case 1:
                        response = _a.sent();
                        build = response.data;
                        return [2 /*return*/, build];
                }
            });
        }); };
        this.startBuildsOnAllBranches = function () { return __awaiter(_this, void 0, void 0, function () {
            var branches, buildRequests, lastBuilds, startBuildRequests, startedBuilds;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBranches()];
                    case 1:
                        branches = _a.sent();
                        buildRequests = branches.map(function (branch) {
                            return _this.getBuildById(branch.lastBuild.id);
                        });
                        return [4 /*yield*/, Promise.all(buildRequests)];
                    case 2:
                        lastBuilds = _a.sent();
                        console.log(lastBuilds);
                        startBuildRequests = branches.map(function (branch) {
                            return _this.startBuild(branch.branch.name, branch.branch.commit.sha);
                        });
                        return [4 /*yield*/, Promise.all(startBuildRequests)];
                    case 3:
                        startedBuilds = _a.sent();
                        this.updateStatus(startedBuilds);
                        return [2 /*return*/];
                }
            });
        }); };
        this.showReport = function (build) {
            console.log(build.sourceBranch + " " + build.id + " " + build.status + " https://api.appcenter.ms/v0.1/apps/" + _this.ownerName + "/" + _this.appName + "/builds/" + build.id + "/logs");
        };
        this.updateStatus = function (startedBuilds) { return __awaiter(_this, void 0, void 0, function () {
            var notCompletedJobs, buildRequests, builds;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startedBuilds.forEach(function (build) {
                            if (build.status === "completed")
                                _this.showReport(build);
                        });
                        notCompletedJobs = startedBuilds.filter(function (build) { return build.status !== "completed"; });
                        if (!notCompletedJobs.length) {
                            return [2 /*return*/];
                        }
                        buildRequests = notCompletedJobs.map(function (build) {
                            return _this.getBuildById(build.id);
                        });
                        return [4 /*yield*/, Promise.all(buildRequests)];
                    case 1:
                        builds = _a.sent();
                        setTimeout(this.updateStatus, 60000, builds);
                        return [2 /*return*/];
                }
            });
        }); };
        var config = {
            baseURL: "https://api.appcenter.ms/v0.1/apps/" + this.ownerName + "/" + this.appName,
            responseType: "json",
            headers: {
                "Content-Type": "application/json",
                "X-API-Token": token,
            },
        };
        this.apiClient = axios_1.default.create(config);
    }
    return AppCenterBuildMonitor;
}());
exports.AppCenterBuildMonitor = AppCenterBuildMonitor;
var ab = new AppCenterBuildMonitor("TmpTst", "v-mazayt-microsoft.com", "4ea11d250087111b3d3d8cbf864caba1761fd88a");
ab.startBuildsOnAllBranches();
