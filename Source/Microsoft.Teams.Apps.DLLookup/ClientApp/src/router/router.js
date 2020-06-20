"use strict";
// <copyright file="router.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var error_page_1 = require("../components/error-page/error-page");
var sign_in_page_1 = require("../components/sign-in-page/sign-in-page");
var sign_in_simple_start_1 = require("../components/sign-in-page/sign-in-simple-start");
var sign_in_simple_end_1 = require("../components/sign-in-page/sign-in-simple-end");
var distribution_lists_1 = require("../components/distribution-lists/distribution-lists");
var add_distribution_list_1 = require("../components/add-distribution-list/add-distribution-list");
var distribution_list_members_1 = require("../components/distribution-list-members/distribution-list-members");
var group_chat_warning_1 = require("../components/group-chat-warning/group-chat-warning");
var api_list_1 = require("../apis/api-list");
require("../i18n");
exports.AppRoute = function () {
    return (React.createElement(react_1.Suspense, { fallback: React.createElement(React.Fragment, null) },
        React.createElement(react_router_dom_1.BrowserRouter, null,
            React.createElement(react_router_dom_1.Switch, null,
                React.createElement(react_router_dom_1.Route, { exact: true, path: "/dls", render: function (props) { return React.createElement(distribution_lists_1.default, __assign({}, props, { getFavoriteDistributionLists: api_list_1.getFavoriteDistributionLists, getDistributionListMembersOnlineCount: api_list_1.getDistributionListMembersOnlineCount, getUserPageSizeChoice: api_list_1.getUserPageSizeChoice, createUserPageSizeChoice: api_list_1.createUserPageSizeChoice, getClientId: api_list_1.getClientId })); } }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: "/dlmemberlist/:id/:name", render: function (props) { return React.createElement(distribution_list_members_1.default, __assign({}, props, { parentDlId: props.match.params.id, parentDLName: props.match.params.name, getDistributionListsMembers: api_list_1.getDistributionListsMembers, pinStatusUpdate: api_list_1.pinStatusUpdate, getUserPresence: api_list_1.getUserPresence, getUserPageSizeChoice: api_list_1.getUserPageSizeChoice, createUserPageSizeChoice: api_list_1.createUserPageSizeChoice })); } }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: "/adfavorite/:isskypedl?", render: function (props) { return React.createElement(add_distribution_list_1.default, __assign({}, props, { getADDistributionLists: api_list_1.getADDistributionLists, createFavoriteDistributionList: api_list_1.createFavoriteDistributionList })); } }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: "/groupchatwarning/:count", render: function (props) { return React.createElement(group_chat_warning_1.default, __assign({}, props, { chatListCount: props.match.params.count })); } }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: "/errorpage", component: error_page_1.default }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: "/errorpage/:id", component: error_page_1.default }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: "/signin", component: sign_in_page_1.default }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: "/signin-simple-start", component: sign_in_simple_start_1.default }),
                React.createElement(react_router_dom_1.Route, { exact: true, path: "/signin-simple-end", component: sign_in_simple_end_1.default })))));
};
//# sourceMappingURL=router.js.map