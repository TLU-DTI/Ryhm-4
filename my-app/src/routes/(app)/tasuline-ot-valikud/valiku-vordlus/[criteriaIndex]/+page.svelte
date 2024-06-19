<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";
  import { onMount, beforeUpdate } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from "$app/stores";
  import { criteriaStore, updateChoiceComparisons } from '../../../../../store/criteriaStore';

  let criteriaIndex: number;
  let criteria: string;
  let choices: string[];
  let comparisons: number[][] = [];

  function initializeData() {
    const store = get(criteriaStore);
    console.log('criteriaStore data on initializeData:', store);
    if (criteriaIndex >= 0 && criteriaIndex < store.criteria.length) {
      criteria = store.criteria[criteriaIndex];
      choices = store.choices;

      // Initialize comparisons matrix if not already done
      comparisons = store.choicesComparisons[criteriaIndex] || Array(choices.length).fill(null).map(() => Array(choices.length).fill(null));
      console.log('Initialized comparisons:', comparisons);
    } else {
      console.warn('Invalid criteriaIndex:', criteriaIndex);
    }
  }

  beforeUpdate(() => {
    const params = get(page).params;
    const newCriteriaIndex = parseInt(params.criteriaIndex, 10);
    if (criteriaIndex !== newCriteriaIndex) {
      console.log('beforeUpdate: criteriaIndex updated to', newCriteriaIndex);
      criteriaIndex = newCriteriaIndex;
      initializeData();
    }
  });

  function handleComparisonChange(i: number, j: number, value: number) {
    console.log(`Updating comparison: criteriaIndex=${criteriaIndex}, i=${i}, j=${j}, value=${value}`);
    updateChoiceComparisons(criteriaIndex, i, j, value);
  }

  function handleNext() {
    // Store comparisons in criteriaStore
    criteriaStore.update(store => {
      store.choicesComparisons[criteriaIndex] = comparisons;
      console.log('Updated criteriaStore with comparisons:', store.choicesComparisons);
      return store;
    });

    // Navigate to the next criteria or finish
    const store = get(criteriaStore);
    if (criteriaIndex < store.criteria.length - 1) {
      goto(`/tasuline-ot-valikud/valiku-vordlus/${criteriaIndex + 1}`);
    } else {
      goto('/tulemused/tulemus'); // Assuming a results page
    }
  }

  onMount(() => {
    const params = get(page).params;
    criteriaIndex = parseInt(params.criteriaIndex, 10);
    console.log('onMount: criteriaIndex set to', criteriaIndex);
    initializeData();
    console.log('criteriaStore data on onMount:', get(criteriaStore));
  });
</script>

<section class="container">
  <h2>Võrdle valikuid, kui kriteerium on: {criteria}</h2>

  {#if choices && choices.length > 0}
    {#each choices as choiceA, i}
      {#each choices as choiceB, j}
        {#if i > j}
          <div class="comparison">
            <span>{choiceA}</span>
            <form class="likert-form">
              {#each Array(5) as _, k}
                <input
                  type="radio"
                  name="comparison-{i}-{j}"
                  value="{5 - k}"
                  on:change={() => handleComparisonChange(i, j, 5 - k)}
                  checked={comparisons[i][j] === 5 - k}
                />
              {/each}
            </form>
            <span>{choiceB}</span>
          </div>
        {/if}
      {/each}
    {/each}
  {/if}

  <button on:click={handleNext}>Edasi</button>
</section>

<style>
  section.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0.7;
  }

  .comparison {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .likert-form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 20px;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: white;
    border-radius: 20px;
    padding: 50px;
    width: 1000px;
    height: auto;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    align-content: center;
  }

  h2 {
    font-size: 30px;
  }
</style>
