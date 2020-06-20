"use strict";
// <copyright file="i18n.ts" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>
Object.defineProperty(exports, "__esModule", { value: true });
var i18next_1 = require("i18next");
var react_i18next_1 = require("react-i18next");
var i18next_xhr_backend_1 = require("i18next-xhr-backend");
i18next_1.default
    .use(i18next_xhr_backend_1.default)
    .use(react_i18next_1.initReactI18next) // passes i18n down to react-i18next
    .init({
    lng: window.navigator.language,
    fallbackLng: 'en-US',
    keySeparator: false,
    interpolation: {
        escapeValue: false // react already safes from xss
    }
});
exports.default = i18next_1.default;
//# sourceMappingURL=i18n.js.map