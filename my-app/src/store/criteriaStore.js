import { writable } from 'svelte/store';

export const criteriaStore = writable({
  criteria: [],
  choices: [],
  criteriaMatrix: [],
  criteriaWeights: [],
  criteriaPercentages: [],
  user_id: null,
  scores: [],
  percentages: [],
  choicesComparisons: []  // Store comparisons for each criteria
});

export function updateCriteriaMatrix(i, j, value) {
  criteriaStore.update(store => {
    store.criteriaMatrix[i][j] = value;
    store.criteriaMatrix[j][i] = 6 - value;
    return store;
  });
  calculateCriteriaWeights();
}

export function calculateCriteriaWeights() {
  criteriaStore.update(store => {
    if (store.criteria.length) {
      let sumCols = store.criteriaMatrix[0].map((_, colIndex) =>
        store.criteriaMatrix.reduce((sum, row) => sum + row[colIndex], 0)
      );
      let normalizedMatrix = store.criteriaMatrix.map(row =>
        row.map((cell, colIndex) => cell / sumCols[colIndex])
      );
      store.criteriaWeights = normalizedMatrix.map(row =>
        row.reduce((sum, cell) => sum + cell, 0) / row.length
      );
      const totalCriteriaWeight = store.criteriaWeights.reduce((sum, weight) => sum + weight, 0);
      store.criteriaPercentages = store.criteriaWeights.map(weight => (weight / totalCriteriaWeight) * 100);
    } else {
      store.criteriaWeights = [];
      store.criteriaPercentages = [];
    }
    return store;
  });
}
