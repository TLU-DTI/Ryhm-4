<script lang="ts">
  import { onMount } from 'svelte';

  export let data: {
    id: number;
    created_at: string;
    model_type: number;
    choices: string[];
    criteria: string[];
    choice_name: string;
    error?: string;
  } | null;

  let choices: string[] = [];
  let criteria: string[] = [];
  let pairwiseMatrices: number[][][] = [];
  let combinedMatrix: number[][] = [];
  let scores: number[] = [];
  let percentages: number[] = [];

  $: if (data) {
    if (data.error) {
      console.error('Error:', data.error);
    } else {
      console.log('Data received as prop:', data);
      choices = Array.isArray(data.choices) ? data.choices : [];
      criteria = Array.isArray(data.criteria) ? data.criteria : [];
      pairwiseMatrices = criteria.map(() =>
        Array(choices.length).fill(null).map(() => Array(choices.length).fill(3))
      ); // Initialize with 3 for indifference
      combinedMatrix = Array(choices.length).fill(null).map(() => Array(choices.length).fill(3));
      calculateScores();
    }
  } else {
    console.error('Data is null or undefined');
  }

  function updateMatrix(criteriaIndex: number, i: number, j: number, value: number): void {
    pairwiseMatrices[criteriaIndex][i][j] = 6 - value;
    pairwiseMatrices[criteriaIndex][j][i] = value; // Correct reciprocal logic
    calculateScores();
  }

  function calculateScores(): void {
    if (criteria.length && choices.length) {
      let criteriaScores = criteria.map((_, criteriaIndex) => {
        let sumCols = pairwiseMatrices[criteriaIndex][0].map((_, colIndex) =>
          pairwiseMatrices[criteriaIndex].reduce((sum, row) => sum + row[colIndex], 0)
        );
        let normalizedMatrix = pairwiseMatrices[criteriaIndex].map(row =>
          row.map((cell, colIndex) => cell / sumCols[colIndex])
        );
        return normalizedMatrix.map(row =>
          row.reduce((sum, cell) => sum + cell, 0) / row.length
        );
      });

      scores = choices.map((_, altIndex) => {
        return criteriaScores.reduce((sum, criteriaScore) => sum + criteriaScore[altIndex], 0) / criteria.length;
      });

      // Calculate combined pairwise matrix
      combinedMatrix = Array(choices.length).fill(null).map(() => Array(choices.length).fill(0));
      for (let i = 0; i < choices.length; i++) {
        for (let j = 0; j < choices.length; j++) {
          combinedMatrix[i][j] = criteria.reduce((sum, _, criteriaIndex) => sum + pairwiseMatrices[criteriaIndex][i][j], 0) / criteria.length;
        }
      }

      // Normalize scores to percentages
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      percentages = scores.map(score => (score / totalScore) * 100);
    } else {
      scores = [];
      combinedMatrix = [];
      percentages = [];
    }
  }

  onMount(() => {
    calculateScores();
  });
</script>

<style>
  .container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }

  .comparison {
    margin-bottom: 20px;
  }

  .radio-group {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .radio-group label {
    margin: 0 5px;
  }
</style>

<div class="container">
  <h1>AHP Car Selection - Multiple Criteria</h1>

  {#if criteria.length && choices.length}
    {#each criteria as criterion, criteriaIndex}
      <div class="comparison">
        <h2>{criterion}</h2>
        {#each choices as alt1, i}
          {#each choices.slice(i + 1) as alt2, j}
            <div class="radio-group">
              <span>{alt1}</span>
              {#each [1, 2, 3, 4, 5] as value}
                <label>
                  <input type="radio" name={`${criteriaIndex}-${i}-${i + j + 1}`} value={value} on:change={(e) => updateMatrix(criteriaIndex, i, i + j + 1, parseFloat(e.target.value))} checked={pairwiseMatrices[criteriaIndex][i][i + j + 1] === 6 - value} />
                  {value}
                </label>
              {/each}
              <span>{alt2}</span>
            </div>
          {/each}
        {/each}
      </div>
    {/each}

    <h2>Combined Pairwise Matrix</h2>
    <table>
      <thead>
        <tr>
          <th></th>
          {#each choices as alt}
            <th>{alt}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each choices as alt1, i}
          <tr>
            <td>{alt1}</td>
            {#each choices as alt2, j}
              <td>
                {combinedMatrix[i][j].toFixed(2)}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>

    <h2>Results</h2>
    <table>
      <thead>
        <tr>
          <th>Alternative</th>
          <th>Score (%)</th>
        </tr>
      </thead>
      <tbody>
        {#each choices as alt, altIndex}
          <tr>
            <td>{alt}</td>
            <td>{#if percentages[altIndex] !== undefined}{percentages[altIndex].toFixed(2)}%{:else}N/A{/if}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p>Loading data or no criteria/choices available.</p>
  {/if}
</div>
