"use strict";
// <copyright file="distribution-list-members.tsx" company="Microsoft">
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
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var Icon_1 = require("office-ui-fabric-react/lib/Icon");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var pagination_1 = require("../pagination/pagination");
require("./distribution-list-members.scss");
var lodash_1 = require("lodash");
var lodash_2 = require("lodash");
var react_i18next_1 = require("react-i18next");
//Exporting DistributionListMembers component
var DistributionListMembers = /** @class */ (function (_super) {
    __extends(DistributionListMembers, _super);
    function DistributionListMembers(props) {
        var _this = _super.call(this, props) || this;
        _this.batchRequestLimit = 40;
        _this.groupChatMembersLimit = 100;
        _this.defaultPageSize = 400;
        _this.notYetFetchedText = "Not yet fetched";
        _this.taskModulePositiveResponseString = "YES";
        _this.availabilityStatusOnline = "Available";
        _this.pageId = 2; //DistributionListMembers.tsx treating as Page id 2
        _this.chatUrl = "https://teams.microsoft.com/l/chat/0/0?users=";
        _this.componentDidMount = function () {
            var historyJson = localStorage.getItem("localStorageHistory");
            if (historyJson != null) {
                _this.historyArray = JSON.parse(historyJson);
                _this.historyArray.push(window.location.href);
                localStorage.setItem("localStorageHistory", JSON.stringify(_this.historyArray));
            }
            else {
                _this.historyArray.push(window.location.href);
                localStorage.setItem("localStorageHistory", JSON.stringify(_this.historyArray));
            }
            _this.getPageSize();
            _this.dataLoad();
            _this.resetSorting(_this.state.distributionListMembers);
        };
        //This function is to load data to state using API.
        _this.dataLoad = function () {
            //API call to get the members of group
            _this.props.getDistributionListsMembers(_this.props.parentDlId).then(function (response) {
                var members = response.data;
                var distributionListMembersTemp = [];
                for (var i = 0; i < members.length; i++) {
                    distributionListMembersTemp.push({
                        id: members[i].id,
                        displayName: members[i].displayName,
                        jobTitle: members[i].jobTitle === null ? "" : members[i].jobTitle,
                        userPrincipalName: members[i].userPrincipalName,
                        mail: members[i].mail,
                        presence: (members[i].type === "#microsoft.graph.group") ? "" : _this.notYetFetchedText,
                        isPinned: members[i].isPinned,
                        isSelected: false,
                        isGroup: members[i].type === "#microsoft.graph.group",
                        sortOrder: 10,
                        type: members[i].type
                    });
                }
                _this.resetSorting(distributionListMembersTemp);
                _this.getAllUserPresenceAsync();
                _this.setState({
                    loader: false
                });
            });
        };
        //To get group members presence information
        _this.getAllUserPresenceAsync = function () { return __awaiter(_this, void 0, void 0, function () {
            var presenceDataList, batchRequests, i;
            var _this = this;
            return __generator(this, function (_a) {
                presenceDataList = [];
                this.state.masterDistributionListMembers.forEach(function (currentDistributionListMember) {
                    if (currentDistributionListMember.presence === _this.notYetFetchedText) {
                        presenceDataList.push({
                            userPrincipalName: currentDistributionListMember.userPrincipalName,
                            availability: "",
                            availabilitySortOrder: 0,
                            id: currentDistributionListMember.id
                        });
                    }
                });
                batchRequests = lodash_1.chunk(presenceDataList, this.batchRequestLimit);
                for (i = 0; i < batchRequests.length; i++) {
                    this.getUserPresenceAsync(batchRequests[i]);
                }
                return [2 /*return*/];
            });
        }); };
        //To get user presence
        _this.getUserPresenceAsync = function (iPresenceDataList) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.props.getUserPresence(iPresenceDataList).then(function (response) {
                    var presenceDataList = response.data;
                    //Set the state for user presence in master distribution list
                    var masterDistributionListMembers = _this.state.masterDistributionListMembers.map(function (currentItem) {
                        if (currentItem.userPrincipalName != null) {
                            var presenceDetailsOfCurrentItem = presenceDataList.find(function (currentPresenceRecord) { return currentPresenceRecord.userPrincipalName.toLowerCase() === currentItem.userPrincipalName.toLowerCase(); });
                            if (presenceDetailsOfCurrentItem !== undefined) {
                                currentItem.presence = presenceDetailsOfCurrentItem.availability;
                                currentItem.sortOrder = presenceDetailsOfCurrentItem.availabilitySortOrder;
                                currentItem.id = presenceDetailsOfCurrentItem.id;
                            }
                        }
                        return currentItem;
                    });
                    //Set the state for user presence in distribution list
                    var distributionListMembers = _this.state.distributionListMembers.map(function (currentItem) {
                        if (currentItem.userPrincipalName != null) {
                            var presenceDetailsOfCurrentItem = presenceDataList.find(function (currentPresenceRecord) { return currentPresenceRecord.userPrincipalName.toLowerCase() === currentItem.userPrincipalName.toLowerCase(); });
                            if (presenceDetailsOfCurrentItem !== undefined) {
                                currentItem.presence = presenceDetailsOfCurrentItem.availability;
                                currentItem.sortOrder = presenceDetailsOfCurrentItem.availabilitySortOrder;
                                currentItem.id = presenceDetailsOfCurrentItem.id;
                            }
                        }
                        return currentItem;
                    });
                    _this.setState({
                        masterDistributionListMembers: masterDistributionListMembers,
                        distributionListMembers: distributionListMembers,
                    });
                    _this.sortColumnItems("presence", true);
                });
                return [2 /*return*/];
            });
        }); };
        // "Render Corresponding Presence Icon"
        _this.renderPresenceInfo = function (presence) {
            switch (presence) {
                case "None":
                    return {
                        "icon": free_solid_svg_icons_1.faCircle,
                        "color": "#D3D3D3",
                        "name": _this.localize("presenceNone")
                    };
                case "Away":
                    return {
                        "icon": free_solid_svg_icons_1.faClock,
                        "color": "#FDB913",
                        "name": _this.localize("presenceAway")
                    };
                case "Offline":
                    return {
                        "icon": free_solid_svg_icons_1.faCircle,
                        "color": "#D3D3D3",
                        "name": _this.localize("presenceOffline")
                    };
                case "DoNotDisturb":
                    return {
                        "icon": free_solid_svg_icons_1.faMinusCircle,
                        "color": "#C4314B",
                        "name": _this.localize("presenceDoNotDisturb")
                    };
                case "BeRightBack":
                    return {
                        "icon": free_solid_svg_icons_1.faClock,
                        "color": "#FDB913",
                        "name": _this.localize("presenceBeRightBack")
                    };
                case "Busy":
                    return {
                        "icon": free_solid_svg_icons_1.faCircle,
                        "color": "#C4314B",
                        "name": _this.localize("presenceBusy")
                    };
                case "Available":
                    return {
                        "icon": free_solid_svg_icons_1.faCheckCircle,
                        "color": "#92C353",
                        "name": _this.localize("presenceOnline")
                    };
                default:
                    return {
                        "icon": free_solid_svg_icons_1.faCircle,
                        "color": "#D3D3D3",
                        "name": _this.localize("presenceOffline")
                    };
            }
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
            var pinnedRecords = _this.state.distributionListMembers.filter(function (e) { return e.isPinned === true; });
            var unpinnedRecords = _this.state.distributionListMembers.filter(function (e) { return e.isPinned === false; });
            pinnedRecords = lodash_2.orderBy(pinnedRecords, [sortColumn], sortOrder === true ? ["asc"] : ["desc"]);
            unpinnedRecords = lodash_2.orderBy(unpinnedRecords, [sortColumn], sortOrder === true ? ["asc"] : ["desc"]);
            var distributionListMembers = pinnedRecords.concat(unpinnedRecords);
            _this.setState({
                distributionListMembers: distributionListMembers
            });
        };
        //Used to reset the sorting on data load
        _this.resetSorting = function (distributionListMembers) {
            var pinnedRecords = distributionListMembers.filter(function (e) { return e.isPinned === true; });
            var unpinnedRecords = distributionListMembers.filter(function (e) { return e.isPinned === false; });
            var sortColumn = _this.state.sortedColumn;
            ;
            pinnedRecords = lodash_2.orderBy(pinnedRecords, sortColumn, ["asc"]);
            unpinnedRecords = lodash_2.orderBy(unpinnedRecords, sortColumn, ["asc"]);
            distributionListMembers = pinnedRecords.concat(unpinnedRecords);
            _this.setState({
                distributionListMembers: distributionListMembers,
                masterDistributionListMembers: distributionListMembers
            });
        };
        //#endregion "Sorting functions"
        //"Search function"
        _this.search = function (e) {
            var searchQuery = e.target.value;
            if (!searchQuery) {
                _this.setState({
                    distributionListMembers: _this.state.masterDistributionListMembers,
                });
            }
            else {
                _this.setState({
                    distributionListMembers: _this.state.masterDistributionListMembers.filter(function (member) { return member.displayName.toLowerCase().includes(searchQuery.toLowerCase()); }),
                    activePage: 0,
                });
            }
        };
        // "Individual record checkbox selected"
        _this.checkboxChanged = function (e, v) {
            var headerCheckValue = true;
            var selectedChkId = e.currentTarget.id;
            _this.state.distributionListMembers.forEach(function (currentItem) {
                if (currentItem.id === selectedChkId) {
                    currentItem.isSelected = v.checked ? v.checked : false;
                    if (currentItem.isSelected) {
                        _this.checkedMembersForChat.push(currentItem);
                    }
                    else {
                        _this.checkedMembersForChat.splice(_this.checkedMembersForChat.findIndex(function (item) { return item.userPrincipalName === currentItem.userPrincipalName; }), 1);
                    }
                }
                if (!currentItem.isSelected) {
                    headerCheckValue = false;
                }
            });
            _this.setState({
                isAllSelectChecked: headerCheckValue
            });
        };
        // "All Select Checkbox selected"
        _this.selectAllCheckboxChanged = function (e, v) {
            var headerChkValue = v.checked ? v.checked : false;
            if (headerChkValue) {
                _this.state.distributionListMembers.forEach(function (currentItem) {
                    if (!currentItem.isGroup) {
                        currentItem.isSelected = headerChkValue;
                        _this.checkedMembersForChat.push(currentItem);
                    }
                });
                _this.setState({
                    isAllSelectChecked: headerChkValue
                });
            }
            else {
                _this.state.distributionListMembers.forEach(function (currentItem) {
                    currentItem.isSelected = headerChkValue;
                });
                _this.checkedMembersForChat = [];
                _this.setState({
                    isAllSelectChecked: headerChkValue
                });
            }
        };
        //To update pin status
        _this.pinStatusUpdate = function (e) {
            var pinId = e.target.id;
            var member = (_this.state.distributionListMembers.filter(function (dlmember) { return dlmember.id === pinId; }));
            var pinStatus = !member[0].isPinned;
            //API call to update the database depending on whether the user pinned or not
            _this.props.pinStatusUpdate(pinId, pinStatus, _this.props.parentDlId).then(function (response) {
                _this.state.distributionListMembers.forEach(function (dlmember) {
                    if (pinId === dlmember.id) {
                        dlmember.isPinned = pinStatus;
                    }
                });
                _this.state.masterDistributionListMembers.forEach(function (dlmember) {
                    if (pinId === dlmember.id) {
                        dlmember.isPinned = pinStatus;
                    }
                });
                _this.setState({
                    distributionListMembers: _this.state.distributionListMembers,
                    masterDistributionListMembers: _this.state.masterDistributionListMembers
                });
                _this.resetSorting(_this.state.distributionListMembers);
            });
        };
        //#region "Set Current Page for Pagination"
        _this.setActivePage = function (newPageNumber) {
            _this.setState({
                activePage: newPageNumber,
            });
        };
        // "Helper for groupChat"
        _this.groupChatLink = function () {
            var userList = _this.checkedMembersForChat.map(function (members) { return members.userPrincipalName; }).join(',');
            return userList;
        };
        // "groupChat from Chat for Nested DL"
        _this.groupChatWithMembers = function () {
            if (_this.checkedMembersForChat.length > _this.groupChatMembersLimit) {
                _this.onOpenTaskModule();
            }
            else {
                var url = _this.chatUrl + _this.groupChatLink();
                microsoftTeams.executeDeepLink(encodeURI(url));
            }
        };
        //"1 on 1 Chat"
        _this.oneOnOneChat = function (e) {
            var url = _this.chatUrl + encodeURI(e.target.id);
            microsoftTeams.executeDeepLink(encodeURI(url));
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
        _this.setPageSize = function (e, v) {
            _this.setState({
                pageSize: Number(v.value),
                activePage: 0,
            });
            //Update database
            _this.props.createUserPageSizeChoice({
                "PageId": _this.pageId,
                "PageSize": v.value
            }).then(function (response) {
                localStorage.setItem('localStorageDLMembersPageSizeValue', (v.value || _this.defaultPageSize).toString());
            });
        };
        //"Group chat task module"
        _this.onOpenTaskModule = function () {
            if (_this.isOpenTaskModuleAllowed) {
                _this.isOpenTaskModuleAllowed = false;
                var taskInfo = {
                    url: configVariables_1.getBaseUrl() + "/groupchatwarning/" + _this.checkedMembersForChat.length,
                    title: "",
                    height: 300,
                    width: 400,
                    fallbackUrl: configVariables_1.getBaseUrl() + "/groupchatwarning" + _this.checkedMembersForChat.length
                };
                var submitHandler = function (err, result) {
                    _this.isOpenTaskModuleAllowed = true;
                    if (result.response === _this.taskModulePositiveResponseString) {
                        _this.checkedMembersForChat = _this.checkedMembersForChat.filter(function (item) { return item.presence === _this.availabilityStatusOnline; });
                        if (_this.checkedMembersForChat.length > _this.groupChatMembersLimit) {
                            _this.checkedMembersForChat.splice(_this.groupChatMembersLimit, _this.checkedMembersForChat.length);
                        }
                        _this.groupChatWithMembers();
                    }
                };
                microsoftTeams.tasks.startTask(taskInfo, submitHandler);
            }
        };
        _this.localize = _this.props.t;
        Icons_1.initializeIcons();
        _this.isOpenTaskModuleAllowed = true;
        _this.checkedMembersForChat = [];
        _this.historyArray = [];
        _this.state = {
            distributionListMembers: [],
            loader: true,
            activePage: 0,
            masterDistributionListMembers: [],
            isAllSelectChecked: false,
            pageSize: _this.defaultPageSize,
            isGoBackClicked: false,
            sortedColumn: "displayName",
            sortDirection: "Down"
        };
        _this.checkboxChanged = _this.checkboxChanged.bind(_this);
        _this.selectAllCheckboxChanged = _this.selectAllCheckboxChanged.bind(_this);
        _this.pinStatusUpdate = _this.pinStatusUpdate.bind(_this);
        _this.groupChatWithMembers = _this.groupChatWithMembers.bind(_this);
        _this.oneOnOneChat = _this.oneOnOneChat.bind(_this);
        return _this;
    }
    //"Render Method"
    DistributionListMembers.prototype.render = function () {
        var _this = this;
        //Page size drop down values.
        var pageSize = [400];
        var pageNumber = this.state.activePage;
        var index = pageSize.indexOf(this.state.pageSize);
        var items = []; //Populate grid
        var _loop_1 = function (j) {
            //#region Populate Grid
            if (j >= this_1.state.distributionListMembers.length) {
                return "break";
            }
            var distributionListMember = this_1.state.distributionListMembers[j];
            if (!distributionListMember.isGroup) {
                items.push(React.createElement(react_1.Segment, { className: "border-none" },
                    React.createElement(react_1.Flex, { gap: "gap.small" },
                        React.createElement(react_1.FlexItem, null,
                            React.createElement(react_1.Checkbox, { key: distributionListMember.userPrincipalName, id: distributionListMember.id, label: distributionListMember.displayName, onClick: this_1.checkboxChanged, checked: distributionListMember.isSelected, disabled: distributionListMember.isGroup })),
                        React.createElement(react_1.FlexItem, null,
                            React.createElement(Icon_1.Icon, { iconName: "Pinned", hidden: !distributionListMember.isPinned, className: "disable-pin" })))));
            }
            else {
                items.push(React.createElement(react_1.Segment, { className: "border-none" },
                    React.createElement(react_1.Flex, { gap: "gap.small" },
                        React.createElement(react_1.FlexItem, null,
                            React.createElement(react_1.Checkbox, { key: distributionListMember.userPrincipalName, id: distributionListMember.id, checked: distributionListMember.isSelected, disabled: distributionListMember.isGroup, className: "group-checkbox dark-theme" })),
                        React.createElement(react_1.FlexItem, null,
                            React.createElement(react_1.Text, { onClick: function () { return window.open("/dlmemberlist/" + distributionListMember.id + "/" + (_this.props.parentDLName + " > " + distributionListMember.displayName), "_self"); }, content: distributionListMember.displayName, title: this_1.localize('viewDetails'), className: "title dark-theme" })),
                        React.createElement(react_1.FlexItem, null,
                            React.createElement(Icon_1.Icon, { iconName: "Pinned", hidden: !distributionListMember.isPinned, className: "disable-pin" })))));
            }
            items.push(React.createElement(react_1.Segment, { className: "border-none", content: distributionListMember.mail }));
            if (this_1.state.distributionListMembers[j].presence === this_1.notYetFetchedText) {
                items.push(React.createElement(react_1.Segment, { className: "border-none" },
                    React.createElement(react_1.Loader, { size: "smallest" })));
            }
            else if (this_1.state.distributionListMembers[j].presence === "") {
                items.push(React.createElement(react_1.Segment, { className: "border-none" },
                    React.createElement(react_1.Flex, { gap: "gap.small" })));
            }
            else {
                var userPresence = this_1.renderPresenceInfo(this_1.state.distributionListMembers[j].presence);
                items.push(React.createElement(react_1.Segment, { className: "border-none" },
                    React.createElement(react_1.Flex, { gap: "gap.small" },
                        React.createElement(react_1.FlexItem, null,
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { className: "presence-icon", icon: userPresence.icon, style: { color: userPresence.color } })),
                        React.createElement(react_1.FlexItem, null,
                            React.createElement(react_1.Text, { content: this_1.state.distributionListMembers[j].presence })))));
            }
            if (distributionListMember.isGroup) {
                items.push(React.createElement(react_1.Segment, { className: "border-none" },
                    React.createElement(react_1.Flex, { gap: "gap.small" },
                        React.createElement(Icon_1.Icon, { iconName: distributionListMember.isPinned ? "Unpin" : "Pinned", className: "seperator-spacing margin", id: distributionListMember.id, onClick: this_1.pinStatusUpdate }))));
            }
            else {
                items.push(React.createElement(react_1.Segment, { className: "border-none actions-style" },
                    React.createElement(react_1.Flex, { gap: "gap.small", className: "action-section" },
                        React.createElement(Icon_1.Icon, { iconName: "Chat", title: "Chat", id: distributionListMember.userPrincipalName, onClick: this_1.oneOnOneChat, className: "title-sort-icon" }),
                        React.createElement(Icon_1.Icon, { iconName: distributionListMember.isPinned ? "Unpin" : "Pinned", title: distributionListMember.isPinned ? "Unpin" : "Pin", className: "seperator-spacing", id: distributionListMember.id, onClick: this_1.pinStatusUpdate }))));
            }
        };
        var this_1 = this;
        for (var j = pageNumber * this.state.pageSize; j < (pageNumber * this.state.pageSize) + this.state.pageSize; j++) {
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
        var navigation = [];
        if (this.props.parentDLName) {
            var groups = this.props.parentDLName.split('>');
            var historyJson = localStorage.getItem("localStorageHistory");
            if (historyJson != null) {
                this.historyArray = JSON.parse(historyJson);
            }
            navigation.push(React.createElement(react_1.Text, { onClick: function () { return window.open(_this.historyArray[0], "_self"); }, className: "nav-header" }, this.localize("distributionListsTitle")));
            var _loop_2 = function (i) {
                navigation.push(React.createElement(react_1.Text, { content: " > ", className: "nav-header-arrow" }));
                if (i < groups.length - 1)
                    navigation.push(React.createElement(react_1.Text, { onClick: function () { return window.open(_this.historyArray[i + 1], "_self"); }, className: "nav-header" }, groups[i]));
                else
                    navigation.push(React.createElement(react_1.Text, { content: groups[i], className: "nav-header-text" }));
            };
            for (var i = 0; i < groups.length; i++) {
                _loop_2(i);
            }
        }
        return (React.createElement("div", { className: "main-component" },
            React.createElement("div", { className: "form-container" },
                React.createElement(react_1.Flex, { space: "between" },
                    React.createElement(react_1.Flex, null, navigation),
                    React.createElement(react_1.Flex, { gap: "gap.small" },
                        React.createElement(react_1.FlexItem, null,
                            React.createElement(react_1.Input, { icon: "search", className: "search-box", placeholder: this.localize("search"), onChange: this.search })),
                        React.createElement(react_1.FlexItem, null,
                            React.createElement(react_1.Button, { content: this.localize("startGroupChat"), disabled: !(this.checkedMembersForChat.length > 1), primary: true, onClick: this.groupChatWithMembers })))),
                React.createElement("br", null),
                React.createElement("div", { className: "form-content-container" },
                    React.createElement(react_1.Grid, { columns: "1.5fr 2fr 1.5fr 1fr" },
                        React.createElement(react_1.Segment, { color: "brand", className: "header" },
                            React.createElement(react_1.Flex, { className: "dark-theme", gap: "gap.small" },
                                React.createElement(react_1.FlexItem, null,
                                    React.createElement(react_1.Checkbox, { className: "dark-theme margin-style", key: "contactName", id: "contactName", label: this.localize("headerContactName"), onClick: this.selectAllCheckboxChanged, checked: this.state.isAllSelectChecked })),
                                React.createElement(react_1.FlexItem, null,
                                    React.createElement(Icon_1.Icon, { className: "dark-theme margin-style", iconName: this.state.sortedColumn == "displayName" ? this.state.sortDirection : "" })),
                                React.createElement(react_1.FlexItem, null,
                                    React.createElement(Icon_1.Icon, { iconName: "ChevronDown", id: "displayName", key: "displayName", className: "title-sort-icon", onClick: function () { return _this.sortDataByColumn("displayName"); } })))),
                        React.createElement(react_1.Segment, { color: "brand", className: "header" },
                            React.createElement(react_1.Flex, { gap: "gap.small" },
                                React.createElement(react_1.FlexItem, null,
                                    React.createElement(react_1.Text, { className: "dark-theme margin-style", content: this.localize("headerContactAlias") })),
                                React.createElement(react_1.FlexItem, null,
                                    React.createElement(Icon_1.Icon, { className: "dark-theme margin-style", iconName: this.state.sortedColumn == "mail" ? this.state.sortDirection : "" })),
                                React.createElement(react_1.FlexItem, null,
                                    React.createElement(Icon_1.Icon, { iconName: "ChevronDown", id: "mail", key: "mail", className: "title-sort-icon dark-theme", onClick: function () { return _this.sortDataByColumn("mail"); } })))),
                        React.createElement(react_1.Segment, { color: "brand", className: "header" },
                            React.createElement(react_1.Flex, { gap: "gap.small" },
                                React.createElement(react_1.FlexItem, null,
                                    React.createElement(react_1.Text, { className: "dark-theme margin-style", content: this.localize("headerPresenceStatus") })),
                                React.createElement(react_1.FlexItem, null,
                                    React.createElement(Icon_1.Icon, { className: "dark-theme margin-style", iconName: this.state.sortedColumn == "presence" ? this.state.sortDirection : "" })),
                                React.createElement(react_1.FlexItem, null,
                                    React.createElement(Icon_1.Icon, { iconName: "ChevronDown", id: "presence", key: "presence", className: "title-sort-icon dark-theme", onClick: function () { return _this.sortDataByColumn("presence"); } })))),
                        React.createElement(react_1.Segment, { color: "brand", content: "Name", className: "header" },
                            React.createElement(react_1.Flex, { gap: "gap.small" })),
                        segmentRows))),
            React.createElement("div", { className: "footer-container" },
                React.createElement(react_1.Segment, { className: "paging-segment" },
                    React.createElement(react_1.Flex, { gap: "gap.small" },
                        React.createElement(pagination_1.default, { callbackFromParent: this.setActivePage, entitiesLength: this.state.distributionListMembers.length, activePage: this.state.activePage, numberOfContents: this.state.pageSize }))))));
    };
    return DistributionListMembers;
}(React.Component));
exports.default = react_i18next_1.withTranslation()(DistributionListMembers);
//# sourceMappingURL=distribution-list-members.js.map