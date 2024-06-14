<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';

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
  let criteriaMatrix: number[][] = [];
  let criteriaWeights: number[] = [];
  let pairwiseMatrices: number[][][] = [];
  let scores: number[] = [];
  let percentages: number[] = [];
  let criteriaPercentages: number[] = [];
  let user_id: number; // Add user_id
  let is_group_decision: boolean = false; // Add group decision flag
  let group_id: number; // Add group_id

  $: if (data) {
    if (data.error) {
      console.error('Error:', data.error);
    } else {
      console.log('Data received as prop:', data);
      choices = Array.isArray(data.choices) ? data.choices : [];
      criteria = Array.isArray(data.criteria) ? data.criteria : [];
      criteriaMatrix = Array(criteria.length).fill(null).map(() => Array(criteria.length).fill(3)); // Initialize with 3 for indifference
      pairwiseMatrices = criteria.map(() =>
        Array(choices.length).fill(null).map(() => Array(choices.length).fill(3))
      ); // Initialize with 3 for indifference
      calculateCriteriaWeights();
    }
  } else {
    console.error('Data is null or undefined');
  }

  function updateCriteriaMatrix(i: number, j: number, value: number): void {
    criteriaMatrix[i][j] = 6 - value;
    criteriaMatrix[j][i] = value; // Correct reciprocal logic
    calculateCriteriaWeights();
  }

  function calculateCriteriaWeights(): void {
    if (criteria.length) {
      let sumCols = criteriaMatrix[0].map((_, colIndex) =>
        criteriaMatrix.reduce((sum, row) => sum + row[colIndex], 0)
      );
      let normalizedMatrix = criteriaMatrix.map(row =>
        row.map((cell, colIndex) => cell / sumCols[colIndex])
      );
      criteriaWeights = normalizedMatrix.map(row =>
        row.reduce((sum, cell) => sum + cell, 0) / row.length
      );
      // Normalize criteria weights to percentages
      const totalCriteriaWeight = criteriaWeights.reduce((sum, weight) => sum + weight, 0);
      criteriaPercentages = criteriaWeights.map(weight => (weight / totalCriteriaWeight) * 100);
      calculateScores();
    } else {
      criteriaWeights = [];
      criteriaPercentages = [];
    }
  }

  function updateMatrix(criteriaIndex: number, i: number, j: number, value: number): void {
    pairwiseMatrices[criteriaIndex][i][j] = 6 - value;
    pairwiseMatrices[criteriaIndex][j][i] = value; // Correct reciprocal logic
    calculateScores();
  }

  function calculateScores(): void {
    if (criteria.length && choices.length) {
      // Calculate scores for each criterion
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

      // Calculate final scores by weighting each criterion score with the criteria weights
      scores = choices.map((_, altIndex) => {
        return criteriaScores.reduce((sum, criteriaScore, criteriaIndex) => sum + criteriaScore[altIndex] * criteriaWeights[criteriaIndex], 0);
      });

      // Normalize scores to percentages
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      percentages = scores.map(score => (score / totalScore) * 100);
    } else {
      scores = [];
      percentages = [];
    }
  }

  async function saveResults() {
    const resultData = {
      premium_decision_id: data.id,
      results: JSON.stringify({ scores, percentages }),
      user_id, // Include user_id
      is_group_decision, // Include group decision flag
      group_id: is_group_decision ? group_id : null // Only include group_id if it's a group decision
    };

    try {
      const response = await fetch('/api/premium-decisions/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving results:', errorData.error);
        alert('Error saving results: ' + errorData.error);
      } else {
        const responseData = await response.json();
        console.log('Results saved successfully:', responseData);
        alert('Results saved successfully');
      }
    } catch (error) {
      console.error('Error in saveResults function:', error);
      alert('Error saving results: ' + error.message);
    }
  }

  onMount(() => {
    calculateCriteriaWeights();
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
  <h1>AHP Car Selection - Criteria Comparison</h1>

  {#if criteria.length}
    <div class="comparison">
      {#each criteria as crit1, i}
        {#each criteria.slice(i + 1) as crit2, j}
          <div class="radio-group">
            <span>{crit1}</span>
            {#each [1, 2, 3, 4, 5] as value}
              <label>
                <input type="radio" name={`criteria-${i}-${i + j + 1}`} value={value} on:change={(e) => updateCriteriaMatrix(i, i + j + 1, parseFloat(e.target.value))} checked={criteriaMatrix[i][i + j + 1] === 6 - value} />
                {value}
              </label>
            {/each}
            <span>{crit2}</span>
          </div>
        {/each}
      {/each}
    </div>
  {:else}
    <p>Loading criteria...</p>
  {/if}

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

  <div class="container">
    <h1>AHP Car Selection - Criteria Comparison</h1>
  
    <div>
      <label>User ID:</label>
      <input type="number" bind:value={user_id} />
    </div>
    
    <div>
      <label>
        <input type="checkbox" bind:checked={is_group_decision} />
        Is this a group decision?
      </label>
    </div>
  
    {#if is_group_decision}
      <div>
        <label>Group ID:</label>
        <input type="number" bind:value={group_id} />
      </div>
    {/if}
  
    <!-- Rest of your existing Svelte template -->
  
    <button on:click={saveResults}>Save Results</button>
  </div>
  

  <h2>Criteria Weights</h2>
  <table>
    <thead>
      <tr>
        <th>Criteria</th>
        <th>Weight (%)</th>
      </tr>
    </thead>
    <tbody>
      {#each criteria as crit, index}
        <tr>
          <td>{crit}</td>
          <td>{#if criteriaPercentages[index] !== undefined}{criteriaPercentages[index].toFixed(2)}%{:else}N/A{/if}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
