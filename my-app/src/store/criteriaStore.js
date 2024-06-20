// my-app\src\store\criteriaStore.js
import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

export const criteriaStore = writable({
    criteria: [],
    choices: [],
    criteriaWeights: [],
    choiceWeights: [],
    user_id: null,
    premium_decisions_id: null,
    scores: [],
    percentages: [],
    choicesComparisons: []  // Store comparisons for each criterion
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

export function calculateChoiceWeights(store) {
    if (store && store.criteria.length && store.choices.length) {
        let choiceScores = Array(store.choices.length).fill(0);
        for (let c = 0; c < store.criteria.length; c++) {
            const weight = store.criteriaWeights[c] / 100; // Convert to fraction
            const comparisons = store.choicesComparisons[c];
            if (comparisons) {
                for (let i = 0; i < comparisons.length; i++) {
                    for (let j = 0; j < comparisons[i].length; j++) {
                        if (comparisons[i][j] !== null) {
                            choiceScores[i] += comparisons[i][j] * weight;
                        }
                    }
                }
            }
        }
        const totalChoiceScore = choiceScores.reduce((sum, score) => sum + score, 0);
        store.choiceWeights = choiceScores.map(score => (score / totalChoiceScore) * 100);
    } else {
        store.choiceWeights = [];
    }
}

export async function calculateFinalResults() {
    criteriaStore.update(async store => {
        if (!store.criteria || !store.choices) {
            console.error('Missing criteria or choices');
            return store;
        }

        let finalScores = Array(store.choices.length).fill(0);

        store.criteria.forEach((criterion, cIndex) => {
            const weight = store.criteriaWeights[cIndex] / 100;
            const comparisons = store.choicesComparisons[cIndex];
            if (comparisons) {
                let localScores = Array(store.choices.length).fill(0);
                for (let i = 0; i < comparisons.length; i++) {
                    for (let j = 0; j < comparisons[i].length; j++) {
                        if (comparisons[i][j] !== null) {
                            localScores[i] += comparisons[i][j];
                        }
                    }
                }
                const totalLocalScore = localScores.reduce((sum, score) => sum + score, 0);
                localScores = localScores.map(score => (score / totalLocalScore) * weight);
                finalScores = finalScores.map((score, i) => score + localScores[i]);
            }
        });

        store.finalResults = finalScores.map(score => score * 100); // Convert to percentage

        // Ensure premium_decision_id and user_id are set
        if (!store.premium_decision_id || !store.user_id) {
            console.error('Missing premium_decision_id or user_id');
            return store;
        }

        // Save results to database
        const { data, error } = await supabase
          .from('premium_decision_results')
          .insert([
            {
              premium_decision_id: store.premium_decision_id,
              results: {
                criteriaWeights: store.criteriaWeights,
                choiceWeights: store.finalResults
              },
              user_id: store.user_id
            }
          ]);

        if (error) {
          console.error('Error saving results:', error);
        } else {
          console.log('Results saved:', data);
        }

        return store;
    });
}

criteriaStore.subscribe(store => {
    if (store.criteria.length && !store.criteriaWeights.length) {
        store.criteriaWeights = Array(store.criteria.length).fill(100); // Initialize weights to 100%
    }
});
