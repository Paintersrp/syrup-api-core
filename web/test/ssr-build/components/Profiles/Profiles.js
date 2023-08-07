"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profiles = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importDefault(require("react"));
const react_query_1 = require("react-query");
const fetchProfiles_1 = require("./fetchProfiles");
const Profile_module_css_1 = __importDefault(require("../Profiles/Profile.module.css"));
const Profiles = () => {
    console.log(Profile_module_css_1.default);
    const { data, isLoading, isError } = (0, react_query_1.useQuery)('profiles', fetchProfiles_1.fetchProfiles, {
        initialData: window.__PRELOADED_DATA__ || [],
    });
    if (isLoading) {
        return react_1.default.createElement("div", null, "Loading...");
    }
    if (isError) {
        return react_1.default.createElement("div", null, "Error loading data");
    }
    return (react_1.default.createElement("table", null, data.map((profile) => (react_1.default.createElement("tr", { key: profile.id },
        react_1.default.createElement("td", null, profile.id),
        react_1.default.createElement("td", null, profile.createdAt),
        react_1.default.createElement("td", null, profile.updatedAt))))));
};
exports.Profiles = Profiles;
