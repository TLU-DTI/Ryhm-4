import { writable } from 'svelte/store';

// Utility function to get the value from sessionStorage and convert it to a number
function getStoredUserId() {
    if (typeof sessionStorage !== 'undefined') {
        const storedValue = sessionStorage.getItem('sat_user_id');
        return storedValue !== null ? Number(storedValue) : null;
    }
    return null;
}

function getStoredGroupId() {
    if (typeof sessionStorage !== 'undefined') {
        const storedValue = sessionStorage.getItem('sat_group_id');
        return storedValue !== null ? Number(storedValue) : null;
    }
    return null;
}

function getStoredUsername() {
    if (typeof sessionStorage !== 'undefined') {
        const storedValue = sessionStorage.getItem('sat_username');
        return storedValue !== null ? String(storedValue) : null;
    }
    return null;
}

function getStoredPremium() {
    if (typeof sessionStorage !== 'undefined') {
        const storedValue = sessionStorage.getItem('sat_premium');
        return storedValue !== null ? storedValue === 'true' : null;
    }
    return null;
}

// Utility function to get the value from sessionStorage and convert it to an array of strings
function getStoredArray() {
    if (typeof sessionStorage !== 'undefined') {
        const storedValue = sessionStorage.getItem('sat_array');
        return storedValue !== null ? JSON.parse(storedValue) : [];
    }
    return [];
}

// Initialize the store with the value from sessionStorage if it exists
const initialUserId = getStoredUserId();
const initialUsername = getStoredUsername();
const initialPremium = getStoredPremium();
const initialGroupId = getStoredGroupId();
const initialArray = getStoredArray(); // example key for array storage

// Create writable stores and set their initial values
export const sat_user_id = writable(initialUserId);
export const sat_username = writable(initialUsername);
export const sat_premium = writable(initialPremium);
export const sat_group_id = writable(initialGroupId);
export const sat_array = writable(initialArray); // writable store for array

// Subscribe to the stores to update sessionStorage whenever the value changes
sat_user_id.subscribe(value => {
    if (typeof sessionStorage !== 'undefined') {
        if (value === null) {
            sessionStorage.removeItem('sat_user_id');
        } else {
            sessionStorage.setItem('sat_user_id', String(value));
        }
    }
});

sat_group_id.subscribe(value => {
    if (typeof sessionStorage !== 'undefined') {
        if (value === null) {
            sessionStorage.removeItem('sat_group_id');
        } else {
            sessionStorage.setItem('sat_group_id', String(value));
        }
    }
});

sat_username.subscribe(value => {
    if (typeof sessionStorage !== 'undefined') {
        if (value === null) {
            sessionStorage.removeItem('sat_username');
        } else {
            sessionStorage.setItem('sat_username', String(value));
        }
    }
});

sat_premium.subscribe(value => {
    if (typeof sessionStorage !== 'undefined') {
        if (value === null) {
            sessionStorage.removeItem('sat_premium');
        } else {
            sessionStorage.setItem('sat_premium', String(value));
        }
    }
});

sat_array.subscribe(value => {
    if (typeof sessionStorage !== 'undefined') {
        if (value.length === 0) {
            sessionStorage.removeItem('sat_array');
        } else {
            sessionStorage.setItem('sat_array', JSON.stringify(value));
        }
    }
});
