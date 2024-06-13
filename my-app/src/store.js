import { writable } from 'svelte/store';

// Utility function to get the value from sessionStorage and convert it to a number
function getStoredUserId() {
    if (typeof sessionStorage !== 'undefined') {
        const storedValue = sessionStorage.getItem('sat_user_id');
        return storedValue !== null ? Number(storedValue) : null;
    }
    return null;
}

// Initialize the store with the value from sessionStorage if it exists
const initialUserId = getStoredUserId();

// Create a writable store and set its initial value
export const sat_user_id = writable(initialUserId);

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
