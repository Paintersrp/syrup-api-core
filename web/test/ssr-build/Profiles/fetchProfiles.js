"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProfiles = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const fetchProfiles = async () => {
    const response = await fetch('http://localhost:4000/profile');
    if (!response.ok) {
        throw new Error('Failed to fetch profiles');
    }
    const res = await response.json();
    return res.data.data;
};
exports.fetchProfiles = fetchProfiles;
