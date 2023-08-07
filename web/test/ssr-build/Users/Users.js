"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importDefault(require("react"));
const react_query_1 = require("react-query");
const fetch_1 = require("./fetch");
const Users_module_css_1 = __importDefault(require("./Users.module.css"));
const Users = () => {
    console.log(Users_module_css_1.default);
    const { data, isLoading, isError } = (0, react_query_1.useQuery)('users', fetch_1.fetchUsersData, {
        initialData: window.__PRELOADED_DATA__ || [],
    });
    if (isLoading) {
        return react_1.default.createElement("div", null, "Loading...");
    }
    if (isError) {
        return react_1.default.createElement("div", null, "Error loading data");
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("table", null, data.map((user) => (react_1.default.createElement("tr", { key: user.id },
            react_1.default.createElement("td", null, user.username),
            react_1.default.createElement("td", null, user.role)))))));
};
exports.Users = Users;
