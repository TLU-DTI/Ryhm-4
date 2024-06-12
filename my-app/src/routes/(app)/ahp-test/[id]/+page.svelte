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

  let criteria: string[] = [];
  let choices: string[] = [];
  let pairwiseMatrices: number[][][] = [];
  let scores: number[] = [];

  $: if (data) {
    if (data.error) {
      console.error('Error:', data.error);
    } else {
      console.log('Data received as prop:', data);
      criteria = Array.isArray(data.criteria) ? data.criteria : [];
      choices = Array.isArray(data.choices) ? data.choices : [];
      pairwiseMatrices = criteria.map(() => {
        let matrix: number[][] = Array(choices.length).fill(null).map(() => Array(choices.length).fill(1));
        return matrix;
      });
      calculateScores();
    }
  } else {
    console.error('Data is null or undefined');
  }

  function updateMatrix(criteriaIndex: number, i: number, j: number, value: number): void {
    pairwiseMatrices[criteriaIndex][i][j] = value;
    pairwiseMatrices[criteriaIndex][j][i] = 1 / value;
    calculateScores();
  }

  function calculateScores(): void {
    if (criteria.length && choices.length) {
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
    } else {
      scores = [];
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

  {#if criteria.length && choices.length}
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
            <td>{#if scores[altIndex] !== undefined}{scores[altIndex].toFixed(2)}{:else}N/A{/if}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p>Loading data or no criteria/choices available.</p>
  {/if}
</div>
