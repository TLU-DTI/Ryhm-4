import { writable, get } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
import { sat_user_id } from '../store.js';

const initialUserId = get(sat_user_id); // Get the initial user ID from the store

export const criteriaStore = writable({
    criteria: [],
    choices: [],
    criteriaWeights: [],
    choiceWeights: [],
    user_id: initialUserId,
    premium_decision_id: null,
    scores: [],
    percentages: [],
    choicesComparisons: []  // Store comparisons for each criterion
});

// Add a subscription to initialize criteriaWeights if not already set
criteriaStore.subscribe(store => {
    if (store.criteria.length && !store.criteriaWeights.length) {
        store.criteriaWeights = Array(store.criteria.length).fill(100); // Initialize weights to 100%
    }
});

export function updateCriterionWeight(index, value) {
    criteriaStore.update(store => {
        if (!store.criteriaWeights.length) {
            store.criteriaWeights = Array(store.criteria.length).fill(100);
        }
        store.criteriaWeights[index] = value;
        calculateChoiceWeights(store);
        return store;
    });
}

export function updateChoiceComparisons(criteriaIndex, i, j, value) {
    criteriaStore.update(store => {
        if (!store.choicesComparisons[criteriaIndex]) {
            store.choicesComparisons[criteriaIndex] = Array(store.choices.length).fill(null).map(() => Array(store.choices.length).fill(null));
        }
        store.choicesComparisons[criteriaIndex][i][j] = value;
        store.choicesComparisons[criteriaIndex][j][i] = 6 - value; // inverse value for the other pair
        calculateChoiceWeights(store);
        return store;
    });
}

function normalizeMatrix(matrix) {
    const size = matrix.length;
    let normalizedMatrix = [];

    // Sum columns
    let columnSums = Array(size).fill(0);
    for (let j = 0; j < size; j++) {
        for (let i = 0; i < size; i++) {
            columnSums[j] += matrix[i][j];
        }
    }

    // Normalize columns
    for (let i = 0; i < size; i++) {
        normalizedMatrix[i] = [];
        for (let j = 0; j < size; j++) {
            normalizedMatrix[i][j] = matrix[i][j] / columnSums[j];
        }
    }

    // Calculate row averages (the weights)
    let weights = Array(size).fill(0);
    for (let i = 0; i < size; i++) {
        let rowSum = 0;
        for (let j = 0; j < size; j++) {
            rowSum += normalizedMatrix[i][j];
        }
        weights[i] = rowSum / size;
    }

    return weights;
}

export function calculateChoiceWeights(store) {
    if (store && store.criteria.length && store.choices.length) {
        let choiceScores = Array(store.choices.length).fill(0);
        
        for (let c = 0; c < store.criteria.length; c++) {
            const weight = store.criteriaWeights[c] / 100; // Convert to fraction
            const comparisons = store.choicesComparisons[c];
            if (comparisons) {
                const criterionWeights = normalizeMatrix(comparisons);
                choiceScores = choiceScores.map((score, i) => score + criterionWeights[i] * weight);
            }
        }
        
        const totalChoiceScore = choiceScores.reduce((sum, score) => sum + score, 0);
        store.choiceWeights = choiceScores.map(score => (score / totalChoiceScore) * 100); // Normalize to 100%
    } else {
        store.choiceWeights = [];
    }
}

export async function calculateFinalResults() {
    const store = get(criteriaStore);

    if (!store.criteria || !store.choices) {
        console.error('Missing criteria or choices');
        return;
    }

    let finalScores = Array(store.choices.length).fill(0);

    store.criteria.forEach((criterion, cIndex) => {
        const weight = store.criteriaWeights[cIndex] / 100;
        const comparisons = store.choicesComparisons[cIndex];
        if (comparisons) {
            const criterionWeights = normalizeMatrix(comparisons);
            finalScores = finalScores.map((score, i) => score + criterionWeights[i] * weight);
        }
    });

    const totalFinalScore = finalScores.reduce((sum, score) => sum + score, 0);
    store.finalResults = finalScores.map(score => (score / totalFinalScore) * 100); // Convert to percentage

    // Ensure premium_decision_id and user_id are set
    if (!store.premium_decision_id || !store.user_id) {
        console.error('Missing premium_decision_id or user_id');
        return;
    }

    // Save results to database
    const { data, error } = await supabase
      .from('premium_decision_results')
      .insert([
        {
          premium_decision_id: store.premium_decision_id,
          results: {
            criteriaWeights: store.criteriaWeights,
            choiceWeights: store.finalResults,
            choicesComparisons: store.choicesComparisons
          },
          user_id: store.user_id
        }
      ]);

    if (error) {
      console.error('Error saving results:', error);
    } else {
      console.log('Results saved:', data);
    }
}