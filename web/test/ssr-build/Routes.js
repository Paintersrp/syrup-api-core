"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const fetchProfiles_1 = require("./Profiles/fetchProfiles");
const Profiles_1 = require("./Profiles/Profiles");
const fetch_1 = require("./Users/fetch");
const Users_1 = require("./Users/Users");
exports.routes = [
    {
        path: '/usersyeet',
        component: Users_1.Users,
        fetchData: fetch_1.fetchUsersData,
        title: 'Users Page',
        metaDescription: 'List of all users',
    },
    {
        path: '/profilesyeet',
        component: Profiles_1.Profiles,
        fetchData: fetchProfiles_1.fetchProfiles,
        title: 'Profiles Page',
        metaDescription: 'List of all user profiles',
    },
];