"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUsersData = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const fetchUsersData = async () => {
    const response = await fetch('http://localhost:4000/users');
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    const res = await response.json();
    return res.data.data;
};
exports.fetchUsersData = fetchUsersData;
