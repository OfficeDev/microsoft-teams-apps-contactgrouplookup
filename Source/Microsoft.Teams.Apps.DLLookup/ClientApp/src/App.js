"use strict";
// <copyright file="App.tsx" company="Microsoft">
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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./App.scss");
var react_1 = require("@stardust-ui/react");
var microsoftTeams = require("@microsoft/teams-js");
var router_1 = require("./router/router");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.componentDidMount = function () {
            microsoftTeams.initialize();
            microsoftTeams.getContext(function (context) {
                var theme = context.theme || "";
                _this.setState({
                    theme: theme
                });
            });
            microsoftTeams.registerOnThemeChangeHandler(function (theme) {
                _this.setState({
                    theme: theme,
                }, function () {
                    _this.forceUpdate();
                });
            });
        };
        /*
            Bug: 3 - uses can choose dark mode (for night view), but that hides many icons.. need to disable night view option..
            Resolution: Prevent darkContainer CSS from being used.
            Future: Change CSS to show icons and text. */
        _this.setThemeComponent = function () {
            // if (this.state.theme === "dark") {
            //     return (
            //         <Provider theme={themes.teamsDark}>
            //             <div className="darkContainer">
            //                 {this.getAppDom()}
            //             </div>
            //         </Provider>
            //     );
            // }
            if (_this.state.theme === "dark") {
                return (React.createElement(react_1.Provider, { theme: react_1.themes.teams },
                    React.createElement("div", { className: "default-container" }, _this.getAppDom())));
            }
            if (_this.state.theme === "contrast") {
                return (React.createElement(react_1.Provider, { theme: react_1.themes.teamsHighContrast },
                    React.createElement("div", { className: "highContrastContainer" }, _this.getAppDom())));
            }
            else {
                return (React.createElement(react_1.Provider, { theme: react_1.themes.teams },
                    React.createElement("div", { className: "default-container" }, _this.getAppDom())));
            }
        };
        _this.getAppDom = function () {
            return (React.createElement("div", { className: "app-container" },
                React.createElement(router_1.AppRoute, null)));
        };
        _this.state = {
            theme: "",
        };
        return _this;
    }
    App.prototype.render = function () {
        return (React.createElement("div", null, this.setThemeComponent()));
    };
    return App;
}(React.Component));
exports.default = App;
//# sourceMappingURL=App.js.map