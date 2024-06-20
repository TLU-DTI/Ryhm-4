import { writable } from 'svelte/store';

// Define initial state
const initialState = {
    decisionName: '',
    modelType: null,
    choices: [],
    criteria: []
};

// Create a writable store
const store = writable({ ...initialState });

// Method to reset the store
function resetStore() {
    store.set({ ...initialState });
}

export const premiumDecisionStore = {
    ...store,
    resetStore
};
