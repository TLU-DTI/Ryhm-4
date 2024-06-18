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

// Initialize the store with the value from sessionStorage if it exists
const initialUserId = getStoredUserId();
const initialUsername  = getStoredUsername();
const initialPremium  = getStoredPremium();
const initialGroupId  = getStoredGroupId();

// Create a writable store and set its initial value
export const sat_user_id = writable(initialUserId);
export const sat_username = writable(initialUsername );
export const sat_premium = writable(initialPremium );
export const sat_group_id = writable(initialGroupId );

// Subscribe to the store to update sessionStorage whenever the value changes
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
