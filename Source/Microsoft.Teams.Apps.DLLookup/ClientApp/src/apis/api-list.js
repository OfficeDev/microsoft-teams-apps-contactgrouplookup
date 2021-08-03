"use strict";
// <copyright file="api-list.ts" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>
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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_jwt_decorator_1 = require("./axios-jwt-decorator");
var configVariables_1 = require("../configVariables");
var baseAxiosUrl = configVariables_1.getBaseUrl() + '/api';
exports.getFavoriteDistributionLists = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = baseAxiosUrl + "/distributionlists";
                return [4 /*yield*/, axios_jwt_decorator_1.default.get(url)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getADDistributionLists = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = baseAxiosUrl + "/distributionlists/getDistributionList?query=" + encodeURIComponent(query);
                return [4 /*yield*/, axios_jwt_decorator_1.default.get(url)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.createFavoriteDistributionList = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = baseAxiosUrl + "/distributionlists";
                return [4 /*yield*/, axios_jwt_decorator_1.default.post(url, payload)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateFavoriteDistributionList = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = baseAxiosUrl + "/distributionlists";
                return [4 /*yield*/, axios_jwt_decorator_1.default.put(url, payload)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.deleteFavoriteDistributionList = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = baseAxiosUrl + "/distributionlists";
                return [4 /*yield*/, axios_jwt_decorator_1.default.delete(url, payload)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getDistributionListsMembers = function (groupId) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = baseAxiosUrl + "/distributionlistmembers?groupId=" + groupId;
                return [4 /*yield*/, axios_jwt_decorator_1.default.get(url)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.pinStatusUpdate = function (pinnedUser, status, distributionListId) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, url, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = {
                    "pinnedUserId": pinnedUser,
                    "distributionListId": distributionListId
                };
                if (!status) return [3 /*break*/, 2];
                url = baseAxiosUrl + "/distributionlistmembers";
                return [4 /*yield*/, axios_jwt_decorator_1.default.post(url, payload)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                url = baseAxiosUrl + "/distributionlistmembers";
                return [4 /*yield*/, axios_jwt_decorator_1.default.delete(url, payload)];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getDistributionListMembersOnlineCount = function (groupId) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = baseAxiosUrl + "/presence/GetDistributionListMembersOnlineCount?groupId=" + groupId;
                return [4 /*yield*/, axios_jwt_decorator_1.default.get(url)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getUserPresence = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = baseAxiosUrl + "/presence/getUserPresence";
                return [4 /*yield*/, axios_jwt_decorator_1.default.post(url, payload)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getUserPageSizeChoice = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = baseAxiosUrl + "/UserPageSize";
                return [4 /*yield*/, axios_jwt_decorator_1.default.get(url)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.createUserPageSizeChoice = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = baseAxiosUrl + "/UserPageSize";
                return [4 /*yield*/, axios_jwt_decorator_1.default.post(url, payload)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getAuthenticationMetadata = function (windowLocationOriginDomain, loginHint) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = { windowLocationOriginDomain: windowLocationOriginDomain, loginhint: loginHint };
                url = baseAxiosUrl + "/authenticationMetadata/GetAuthenticationUrlWithConfiguration";
                return [4 /*yield*/, axios_jwt_decorator_1.default.post(url, payload)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getClientId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = baseAxiosUrl + "/authenticationMetadata/getClientId";
                return [4 /*yield*/, axios_jwt_decorator_1.default.get(url)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
//# sourceMappingURL=api-list.js.map