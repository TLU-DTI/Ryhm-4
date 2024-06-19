import { writable } from 'svelte/store';

export const criteriaStore = writable({
  criteria: [],
  choices: [],
  criteriaWeights: [],
  choiceWeights: [],
  user_id: null,
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
            choiceScores[i] += comparisons[i][j] * weight;
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

criteriaStore.subscribe(store => {
  if (store.criteria.length && !store.criteriaWeights.length) {
    store.criteriaWeights = Array(store.criteria.length).fill(100); // Initialize weights to 100%
  }
});
