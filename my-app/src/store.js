import { writable } from 'svelte/store';

// Utility function to get the value from localStorage and convert it to a number
function getStoredUserId() {
    if (typeof localStorage !== 'undefined') {
        const storedValue = localStorage.getItem('sat_user_id');
        return storedValue !== null ? Number(storedValue) : null;
    }
    return null;
}

// Initialize the store with the value from localStorage if it exists
const initialUserId = getStoredUserId();

// Create a writable store and set its initial value
export const sat_user_id = writable(initialUserId);

// Subscribe to the store to update localStorage whenever the value changes
sat_user_id.subscribe(value => {
    if (typeof localStorage !== 'undefined') {
        if (value === null) {
            localStorage.removeItem('sat_user_id');
        } else {
            localStorage.setItem('sat_user_id', String(value));
        }
    }
});
