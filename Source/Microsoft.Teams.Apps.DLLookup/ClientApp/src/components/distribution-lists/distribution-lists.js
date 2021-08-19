"use strict";
// <copyright file="distribution-lists.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var React = require("react");
var Icons_1 = require("office-ui-fabric-react/lib/Icons");
var configVariables_1 = require("../../configVariables");
var microsoftTeams = require("@microsoft/teams-js");
var react_1 = require("@stardust-ui/react");
var Icon_1 = require("office-ui-fabric-react/lib/Icon");
var api_list_1 = require("../../apis/api-list");
var pagination_1 = require("../pagination/pagination");
require("./distribution-lists.scss");
var lodash_1 = require("lodash");
var react_i18next_1 = require("react-i18next");
var DistributionLists = /** @class */ (function (_super) {
    __extends(DistributionLists, _super);
    function DistributionLists(props) {
        var _this = _super.call(this, props) || this;
        _this.defaultPageSize = 20;
        _this.notYetFetchedText = "Not yet fetched";
        _this.pageId = 1; //DistributionLists.tsx treating as Page id 1
        _this.componentDidMount = function () {
            //Save Page URL to local storage to use for Back button in Distribution list members page
            var historyJson = localStorage.getItem("localStorageHistory");
            if (historyJson != null) {
                _this.historyArray = JSON.parse(historyJson);
                if (_this.historyArray.length > 0) {
                    _this.historyArray = [];
                    _this.historyArray.push(window.location.href);
                    localStorage.setItem("localStorageHistory", JSON.stringify(_this.historyArray));
                }
                else {
                    _this.historyArray.push(window.location.href);
                    localStorage.setItem("localStorageHistory", JSON.stringify(_this.historyArray));
                }
            }
            else {
                _this.historyArray.push(window.location.href);
                localStorage.setItem("localStorageHistory", JSON.stringify(_this.historyArray));
            }
            document.addEventListener("keydown", _this.escFunction, false);
            _this.getPageSize();
            _this.dataLoad();
        };
        _this.componentWillUnmount = function () {
            document.removeEventListener("keydown", _this.escFunction, false);
        };
        //This function is to load data to state using API or from local storage.
        _this.dataLoad = function () {
            //To delete local storage copy
            if (localStorage.getItem('localStorageMasterDistributionListsTime') !== null) {
                var jsonFromLocalStorage = localStorage.getItem('localStorageMasterDistributionListsTime');
                if (jsonFromLocalStorage != null) {
                    var dateFromLocalStorage = JSON.parse(jsonFromLocalStorage);
                    var now = new Date().getTime();
                    var diffInMinutes = Math.floor(Math.abs(dateFromLocalStorage - now) / 60000);
                    if (diffInMinutes > 1) {
                        localStorage.removeItem('localStorageMasterDistributionListsTime');
                        localStorage.removeItem('localStorageMasterDistributionLists');
                    }
                }
            }
            //To load data from local storage
            if (localStorage.getItem('localStorageMasterDistributionLists') !== null) {
                var jsonFromLocalStorage = localStorage.getItem('localStorageMasterDistributionLists');
                if (jsonFromLocalStorage != null) {
                    var distributionLists = JSON.parse(jsonFromLocalStorage);
                    _this.setState({
                        distributionLists: distributionLists,
                        masterDistributionLists: distributionLists,
                        loader: false,
                    }, function () {
                        _this.getAllDistributionListMembersOnlineCount();
                    });
                }
            }
            else {
                //To load data from server
                _this.props.getFavoriteDistributionLists().then(function (response) {
                    var favorites = response.data;
                    var distributionLists = [];
                    for (var i = 0; i < favorites.length; i++) {
                        distributionLists.push({
                            id: favorites[i].id,
                            displayName: favorites[i].displayName,
                            mail: favorites[i].mail,
                            contactsCount: favorites[i].contactsCount,
                            onlineContactsCount: _this.notYetFetchedText,
                            isPinned: favorites[i].isPinned,
                        });
                    }
                    distributionLists = _this.resetSorting(distributionLists);
                    if (favorites.length !== 0) {
                        //If favorite distribution lists exists
                        _this.setState({
                            distributionLists: distributionLists,
                            masterDistributionLists: distributionLists,
                            loader: false,
                        });
                        var now = new Date().getTime();
                        localStorage.setItem("localStorageMasterDistributionLists", JSON.stringify(distributionLists));
                        localStorage.setItem("localStorageMasterDistributionListsTime", JSON.stringify(now));
                        _this.getAllDistributionListMembersOnlineCount();
                    }
                    else {
                        _this.setState({
                            loader: false,
                        });
                    }
                });
            }
        };
        //Calling respective method, if online count is not fetched yet.
        _this.getAllDistributionListMembersOnlineCount = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.state.masterDistributionLists.forEach(function (currentDistributionList) {
                    if (currentDistributionList.onlineContactsCount === _this.notYetFetchedText) {
                        _this.getDistributionListMembersOnlineCountAsync(currentDistributionList);
                    }
                });
                return [2 /*return*/];
            });
        }); };
        //Call API to get online count 
        _this.getDistributionListMembersOnlineCountAsync = function (distributionList) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.props.getDistributionListMembersOnlineCount(distributionList.id).then(function (response) {
                    //Setting state for master distribution List
                    _this.setState(function (state) {
                        var masterDistributionLists = state.masterDistributionLists.map(function (currentItem) {
                            if (distributionList.id === currentItem.id) {
                                currentItem.onlineContactsCount = response.data;
                            }
                            return currentItem;
                        });
                        return {
                            masterDistributionLists: masterDistributionLists,
                        };
                    });
                    //Setting state for distribution list
                    _this.setState(function (state) {
                        var distributionLists = state.distributionLists.map(function (currentItem) {
                            if (distributionList.id === currentItem.id) {
                                currentItem.onlineContactsCount = response.data;
                            }
                            return currentItem;
                        });
                        return {
                            distributionLists: distributionLists,
                        };
                    });
                    localStorage.setItem("localStorageMasterDistributionLists", JSON.stringify(_this.state.masterDistributionLists));
                });
                return [2 /*return*/];
            });
        }); };
        // To delete/Hide from favorites
        _this.deleteFavorites = function (e) {
            var distributionListId = e.target.id;
            var masterDistributionLists = (_this.state.masterDistributionLists.filter(function (distributionList) { return distributionList.id !== distributionListId; }));
            var distributionLists = (_this.state.distributionLists.filter(function (distributionList) { return distributionList.id !== distributionListId; }));
            var userHideRecord = {
                id: distributionListId,
            };
            // Calling api to delete from favorite distribution lists
            api_list_1.deleteFavoriteDistributionList(userHideRecord).then(function (response) {
                if (response.status === 200) {
                    _this.setState({
                        distributionLists: distributionLists,
                        masterDistributionLists: masterDistributionLists,
                    });
                    localStorage.setItem("localStorageMasterDistributionLists", JSON.stringify(_this.state.masterDistributionLists));
                }
            });
        };
        //To change record Pin/Unpin status
        _this.changePinStatus = function (e) {
            var distributionListId = e.target.id;
            var distributionList = (_this.state.distributionLists.filter(function (list) { return list.id === distributionListId; }));
            var pinStatus = !distributionList[0].isPinned;
            var userPinChangeRecord = {
                id: distributionListId,
                isPinned: pinStatus,
            };
            //Call api to update Pin status in database
            api_list_1.updateFavoriteDistributionList(userPinChangeRecord).then(function (response) {
                var favorites = _this.state.distributionLists;
                var masterFavorites = _this.state.masterDistributionLists;
                //Update pin status to local copy
                for (var i = 0; i < favorites.length; i++) {
                    if (distributionListId === favorites[i].id)
                        favorites[i].isPinned = pinStatus;
                }
                //Update pin status to local master copy
                for (var i = 0; i < masterFavorites.length; i++) {
                    if (distributionListId === masterFavorites[i].id)
                        masterFavorites[i].isPinned = pinStatus;
                }
                if (response.status === 200) {
                    _this.setState({
                        distributionLists: _this.resetSorting(favorites),
                        masterDistributionLists: _this.resetSorting(masterFavorites),
                    });
                    localStorage.setItem("localStorageMasterDistributionLists", JSON.stringify(_this.state.masterDistributionLists));
                }
            });
        };
        //#region "Sorting functions"
        //Calling appropriate function based on column selected for sorting
        _this.sortDataByColumn = function (column) {
            var directionBool = false;
            if (_this.state.sortedColumn !== column) {
                _this.setState({
                    sortedColumn: column,
                    sortDirection: "Down"
                });
                directionBool = true;
            }
            else if (_this.state.sortedColumn === column) {
                var direction = _this.state.sortDirection === "Up" ? "Down" : "Up";
                _this.setState({
                    sortedColumn: column,
                    sortDirection: direction
                });
                directionBool = _this.state.sortDirection === "Up" ? true : false;
            }
            _this.sortColumnItems(column, directionBool);
        };
        //Setting the sort icons and sorting pinned-unpinned records separately
        _this.sortColumnItems = function (sortColumn, sortOrder) {
            var pinnedRecords = _this.state.distributionLists.filter(function (e) { return e.isPinned === true; });
            var unpinnedRecords = _this.state.distributionLists.filter(function (e) { return e.isPinned === false; });
            pinnedRecords = lodash_1.orderBy(pinnedRecords, [sortColumn], sortOrder === true ? ["asc"] : ["desc"]);
            unpinnedRecords = lodash_1.orderBy(unpinnedRecords, [sortColumn], sortOrder === true ? ["asc"] : ["desc"]);
            var distributionLists = pinnedRecords.concat(unpinnedRecords); //Concatenate both
            _this.setState({
                distributionLists: distributionLists,
            });
        };
        //Reset Sorting on data reload
        _this.resetSorting = function (favoriteDLs) {
            var pinnedRecords = favoriteDLs.filter(function (e) { return e.isPinned === true; });
            var unpinnedRecords = favoriteDLs.filter(function (e) { return e.isPinned === false; });
            var sortColumn = _this.state.sortedColumn; //Default sort Column
            pinnedRecords = lodash_1.orderBy(pinnedRecords, [sortColumn], ["asc"]);
            unpinnedRecords = lodash_1.orderBy(unpinnedRecords, [sortColumn], ["asc"]);
            favoriteDLs = pinnedRecords.concat(unpinnedRecords);
            return favoriteDLs;
        };
        //#endregion "Sorting functions"
        //#region "Search function"
        _this.searchFavoriteDLs = function (e) {
            var searchQuery = e.target.value;
            if (!searchQuery) // If Search text cleared
             {
                _this.setState({
                    distributionLists: _this.state.masterDistributionLists,
                });
            }
            else {
                _this.setState({
                    distributionLists: _this.state.masterDistributionLists.filter(function (list) { return list.displayName.toLowerCase().includes(searchQuery.toLowerCase()); }),
                    activePage: 0,
                });
            }
            _this.getAllDistributionListMembersOnlineCount();
        };
        //#endregion "Search function"
        //This function call back from Paging component
        _this.setActivePage = function (newPageNumber) {
            _this.setState({
                activePage: newPageNumber,
            });
        };
        //Get Page size from database/local storage
        _this.getPageSize = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (localStorage.getItem('localStorageDLPageSizeValue') === null || localStorage.getItem('localStorageDLPageSizeValue') === undefined) {
                    this.props.getUserPageSizeChoice().then(function (response) {
                        if (response.data) {
                            _this.setState({
                                pageSize: response.data.distributionListPageSize === 0 ? _this.defaultPageSize : response.data.distributionListPageSize
                            });
                            localStorage.setItem('localStorageDLPageSizeValue', response.data.distributionListPageSize === 0 ? _this.defaultPageSize.toString() : response.data.distributionListPageSize.toString());
                            localStorage.setItem('localStorageDLMembersPageSizeValue', response.data.distributionListMemberPageSize === 0 ? _this.defaultPageSize.toString() : response.data.distributionListMemberPageSize.toString());
                        }
                        else {
                            localStorage.setItem('localStorageDLPageSizeValue', _this.defaultPageSize.toString());
                            localStorage.setItem('localStorageDLMembersPageSizeValue', _this.defaultPageSize.toString());
                        }
                    });
                }
                else {
                    this.setState({
                        pageSize: Number(localStorage.getItem('localStorageDLPageSizeValue'))
                    });
                }
                return [2 /*return*/];
            });
        }); };
        //setting page size
        _this.setPageSize = function (e, pageSizeDropdownProps) {
            _this.setState({
                pageSize: Number(pageSizeDropdownProps.value),
                activePage: 0
            });
            _this.props.createUserPageSizeChoice({
                "PageId": _this.pageId,
                "PageSize": pageSizeDropdownProps.value
            }).then(function (response) {
                localStorage.setItem('localStorageDLPageSizeValue', (pageSizeDropdownProps.value || _this.defaultPageSize).toString());
            });
        };
        //To open "Add Distribution list" task module
        _this.onOpenTaskModule = function () {
            if (_this.isOpenTaskModuleAllowed) {
                _this.isOpenTaskModuleAllowed = false;
                var url = configVariables_1.getBaseUrl() + "/adfavorite";
                var taskInfo = {
                    url: url,
                    title: _this.localize('addFavoriteDistributionList'),
                    height: 650,
                    width: 700,
                    fallbackUrl: url,
                };
                var submitHandler = function (err, result) {
                    _this.isOpenTaskModuleAllowed = true;
                    if (result != null) {
                        if (result.output === "success") {
                            localStorage.removeItem('localStorageMasterDistributionListsTime');
                            localStorage.removeItem('localStorageMasterDistributionLists');
                            _this.dataLoad();
                        }
                    }
                    else {
                        _this.setState({
                            loader: false,
                        });
                    }
                };
                microsoftTeams.tasks.startTask(taskInfo, submitHandler);
            }
        };
        //Handles escape function
        _this.escFunction = function (e) {
            if (e.keyCode === 27 || (e.key === "Escape")) {
                microsoftTeams.tasks.submitTask();
            }
        };
        _this.localize = _this.props.t;
        Icons_1.initializeIcons();
        _this.escFunction = _this.escFunction.bind(_this);
        _this.isOpenTaskModuleAllowed = true;
        _this.historyArray = [];
        _this.state = {
            distributionLists: [],
            masterDistributionLists: [],
            loader: true,
            activePage: 0,
            pageSize: _this.defaultPageSize,
            sortedColumn: "displayName",
            sortDirection: "Down"
        };
        return _this;
    }
    DistributionLists.prototype.render = function () {
        var _this = this;
        //Page size drop down values.
        var pageSize = [20, 50, 100];
        var index = pageSize.indexOf(this.state.pageSize);
        var items = []; //Populate grid items
        var _loop_1 = function (j) {
            if (j >= this_1.state.distributionLists.length) // If it crosses last record
                return "break";
            items.push(React.createElement(react_1.Segment, { className: "border-none" },
                React.createElement(react_1.Flex, { gap: "gap.small" },
                    React.createElement(react_1.FlexItem, null,
                        React.createElement(react_1.Text, { onClick: function () { return window.open("/dlmemberlist/" + _this.state.distributionLists[j].id + "/" + _this.state.distributionLists[j].displayName, "_self"); }, content: this_1.state.distributionLists[j].displayName, title: this_1.localize('viewDetails'), className: "title" })),
                    React.createElement(react_1.FlexItem, null,
                        React.createElement(Icon_1.Icon, { iconName: "Pinned", hidden: !this_1.state.distributionLists[j].isPinned, className: "disable-pin" })))));
            items.push(React.createElement(react_1.Segment, { content: this_1.state.distributionLists[j].mail, className: "border-none" }));
            items.push(React.createElement(react_1.Segment, { content: this_1.state.distributionLists[j].contactsCount, className: "border-none" }));
            if (this_1.state.distributionLists[j].onlineContactsCount === this_1.notYetFetchedText)
                items.push(React.createElement(react_1.Segment, { className: "border-none" },
                    React.createElement(react_1.Loader, { size: "smallest" }),
                    " "));
            else
                items.push(React.createElement(react_1.Segment, { className: "border-none" },
                    React.createElement(react_1.Text, { content: this_1.state.distributionLists[j].onlineContactsCount })));
            items.push(React.createElement(react_1.Segment, { className: "border-none actions-style" },
                React.createElement(react_1.Flex, { gap: "gap.small" },
                    React.createElement(Icon_1.Icon, { iconName: !this_1.state.distributionLists[j].isPinned ? "Pinned" : "Unpin", title: !this_1.state.distributionLists[j].isPinned ? this_1.localize('pin') : this_1.localize('unpin'), className: "seperator-spacing", id: this_1.state.distributionLists[j].id, onClick: this_1.changePinStatus }),
                    "\u00A0",
                    React.createElement(Icon_1.Icon, { iconName: "Delete", title: this_1.localize('delete'), className: "seperator-spacing", id: this_1.state.distributionLists[j].id, onClick: this_1.deleteFavorites }))));
        };
        var this_1 = this;
        for (var j = this.state.activePage * this.state.pageSize; j < (this.state.activePage * this.state.pageSize) + this.state.pageSize; j++) // 20 is records per page
         {
            var state_1 = _loop_1(j);
            if (state_1 === "break")
                break;
        }
        var segmentRows = []; //Populate grid 
        if (this.state.loader) {
            segmentRows.push(React.createElement(react_1.Segment, { styles: { gridColumn: 'span 5', } },
                React.createElement(react_1.Loader, null)));
        }
        else {
            segmentRows.push(items);
        }
        if (!this.state.loader && this.state.distributionLists.length === 0 && this.state.masterDistributionLists.length === 0) // If there are no favorites saved
         {
            return (React.createElement("div", { className: "emptydiv" },
                React.createElement(react_1.Text, { content: this.localize('welcomeMessage'), className: "welcome-text" }),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement(react_1.Text, { content: this.localize('getStarted'), className: "get-started" }),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement(react_1.Button, { content: this.localize('addDistributionList'), onClick: function () { return _this.onOpenTaskModule(); }, primary: true }),
                React.createElement("br", null),
                React.createElement("br", null)));
        }
        else {
            return (React.createElement("div", { className: "main-component", key: "dlkey" },
                React.createElement("div", { className: "form-container" },
                    React.createElement(react_1.Flex, { space: "between" },
                        React.createElement(react_1.FlexItem, { grow: true },
                            React.createElement(react_1.Text, { content: this.localize('distributionListsTitle'), size: "larger", weight: "semibold", className: "textstyle" },
                                this.localize('distributionListsTitle'),
                                React.createElement(Icon_1.Icon, { title: this.localize('appInfo'), className: "info-icon", iconName: "Info" }))),
                        React.createElement(react_1.Flex, { gap: "gap.small" },
                            React.createElement("div", { className: "div-style" },
                                React.createElement(react_1.Dropdown, { className: "bg-color", fluid: true, items: pageSize, placeholder: this.localize('pageSizeGroups'), highlightedIndex: index, onSelectedChange: this.setPageSize, checkable: true })),
                            React.createElement(react_1.Input, { "aria-label": this.localize('search'), icon: "search", placeholder: this.localize('search'), onChange: this.searchFavoriteDLs, className: "search-box" }),
                            React.createElement(react_1.Button, { "aria-label": this.localize('addDistributionList'), content: this.localize('addDistributionList'), onClick: function () { return _this.onOpenTaskModule(); }, primary: true }))),
                    React.createElement("br", null),
                    React.createElement("div", { className: "form-content-container" },
                        React.createElement(react_1.Grid, { columns: "2.3fr 2fr 1.3fr 1.3fr 1.5fr" },
                            React.createElement(react_1.Segment, { color: "brand", className: "header" },
                                React.createElement(react_1.Flex, { gap: "gap.small" },
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(react_1.Text, { content: this.localize('headerName'), className: "text-style" })),
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(Icon_1.Icon, { iconName: this.state.sortedColumn == "displayName" ? this.state.sortDirection : "", className: "title-sort-icon" })),
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(Icon_1.Icon, { iconName: "ChevronDown", className: "title-sort-icon", onClick: function () { return _this.sortDataByColumn("displayName"); } })))),
                            React.createElement(react_1.Segment, { color: "brand", className: "header" },
                                React.createElement(react_1.Flex, { gap: "gap.small" },
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(react_1.Text, { content: this.localize('headerAlias'), className: "text-style" })),
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(Icon_1.Icon, { className: "text-style", iconName: this.state.sortedColumn == "mail" ? this.state.sortDirection : "" })),
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(Icon_1.Icon, { iconName: "ChevronDown", className: "title-sort-icon", onClick: function () { return _this.sortDataByColumn("mail"); } })))),
                            React.createElement(react_1.Segment, { color: "brand", className: "header" },
                                React.createElement(react_1.Flex, { gap: "gap.small" },
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(react_1.Text, { content: this.localize('headerMembersCount'), className: "text-style" })),
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(Icon_1.Icon, { iconName: this.state.sortedColumn == "contactsCount" ? this.state.sortDirection : "" })),
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(Icon_1.Icon, { iconName: "ChevronDown", className: "title-sort-icon", onClick: function () { return _this.sortDataByColumn("contactsCount"); } })))),
                            React.createElement(react_1.Segment, { color: "brand", className: "header" },
                                React.createElement(react_1.Flex, { gap: "gap.small" },
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(react_1.Text, { content: this.localize('headerMembersOnline'), className: "text-style" })),
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(Icon_1.Icon, { iconName: this.state.sortedColumn == "onlineContactsCount" ? this.state.sortDirection : "" })),
                                    React.createElement(react_1.FlexItem, null,
                                        React.createElement(Icon_1.Icon, { iconName: "ChevronDown", className: "title-sort-icon", onClick: function () { return _this.sortDataByColumn("onlineContactsCount"); } })))),
                            React.createElement(react_1.Segment, { color: "brand", className: "header" },
                                React.createElement(react_1.Flex, { gap: "gap.small" })),
                            segmentRows))),
                React.createElement("div", { className: "footer-container" },
                    React.createElement(react_1.Segment, { className: "paging-segment" },
                        React.createElement(react_1.Flex, { gap: "gap.small" },
                            React.createElement(pagination_1.default, { callbackFromParent: this.setActivePage, entitiesLength: this.state.distributionLists.length, activePage: this.state.activePage, numberOfContents: this.state.pageSize }))))));
        }
    };
    return DistributionLists;
}(React.Component));
exports.default = react_i18next_1.withTranslation()(DistributionLists);
//# sourceMappingURL=distribution-lists.js.map