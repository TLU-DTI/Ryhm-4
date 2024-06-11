<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch, params }) => {
    const response = await fetch(`/api/premium-decisions/${params.id}`);
    const data = await response.json();

    if (!data || data.error) {
      throw new Error('Data not found');
    }

    return { props: { data } };
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';

  type PremiumDecision = {
    id: number;
    created_at: string;
    model_type: number;
    choices: string[];
    criteria: string[];
    choice_name: string;
  };

  export let data: PremiumDecision;

  let criteria = data.criteria;
  let choices = data.choices;

  let pairwiseMatrices: number[][][] = criteria.map(() => {
    let matrix: number[][] = Array(choices.length).fill(null).map(() => Array(choices.length).fill(1));
    return matrix;
  });

  let scores: number[] = [];

  function updateMatrix(criteriaIndex: number, i: number, j: number, value: number): void {
    pairwiseMatrices[criteriaIndex][i][j] = value;
    pairwiseMatrices[criteriaIndex][j][i] = 1 / value;
    calculateScores();
  }

  function calculateScores(): void {
    let criteriaScores = criteria.map((_, criteriaIndex) => {
      let matrix = pairwiseMatrices[criteriaIndex];
      let sumCols = matrix[0].map((_, colIndex) => matrix.reduce((sum, row) => sum + row[colIndex], 0));
      let normalizedMatrix = matrix.map(row => row.map((cell, colIndex) => cell / sumCols[colIndex]));
      let priorityVector = normalizedMatrix.map(row => row.reduce((sum, cell) => sum + cell, 0) / row.length);
      return priorityVector;
    });

    scores = choices.map((_, altIndex) => {
      return criteriaScores.reduce((sum, criteriaScore) => sum + criteriaScore[altIndex], 0) / criteria.length;
    });
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

  .criteria {
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
  }
</style>

<div class="container">
  <h1>AHP Car Selection</h1>

  {#each criteria as criterion, criteriaIndex}
    <div class="criteria">
      <h2>{criterion}</h2>
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
                  {#if i === j}
                    1
                  {:else if i < j}
                    <input type="number" min="1" max="5" bind:value={pairwiseMatrices[criteriaIndex][i][j]} on:input={(e) => updateMatrix(criteriaIndex, i, j, parseFloat(e.target.value))} />
                  {:else}
                    {pairwiseMatrices[criteriaIndex][i][j].toFixed(2)}
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/each}

  <h2>Results</h2>
  <table>
    <thead>
      <tr>
        <th>Alternative</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      {#each choices as alt, altIndex}
        <tr>
          <td>{alt}</td>
          <td>{scores[altIndex].toFixed(2)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
