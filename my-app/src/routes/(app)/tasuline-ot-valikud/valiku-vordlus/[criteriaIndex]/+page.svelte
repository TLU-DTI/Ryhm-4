<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from "$app/stores";
  import { criteriaStore, updateChoiceComparisons } from '../../../../../store/criteriaStore';

  let criteriaIndex: number;
  let criteria;
  let choices;
  let comparisons = [];

  function initializeData() {
    const store = get(criteriaStore);
    criteria = store.criteria[criteriaIndex];
    choices = store.choices;

    // Initialize comparisons matrix if not already done
    comparisons = store.choicesComparisons[criteriaIndex] || Array(choices.length).fill(null).map(() => Array(choices.length).fill(null));
  }

  $: {
    const params = get(page).params;
    const newCriteriaIndex = parseInt(params.criteriaIndex, 10);
    if (criteriaIndex !== newCriteriaIndex) {
      criteriaIndex = newCriteriaIndex;
      initializeData();
    }
  }

  function handleComparisonChange(i, j, value) {
    updateChoiceComparisons(criteriaIndex, i, j, value);
  }

  function handleNext() {
    // Store comparisons in criteriaStore
    criteriaStore.update(store => {
      store.choicesComparisons[criteriaIndex] = comparisons;
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
    initializeData();
  });
</script>

<section class="container">
  <h2>Võrdle valikuid, kui kriteerium on: <br> {criteria}</h2>

  {#if choices && choices.length > 0}
    {#each choices as choiceA, i}
      {#each choices as choiceB, j}
        {#if i > j}
          <div class="comparison">
            <p>{choiceA}</p>
            <form class="likert-form">
              {#each Array(5) as _, k}
                <input
                  class="valimine"
                  type="radio"
                  name="comparison-{i}-{j}"
                  value="{5 - k}"
                  on:change={() => handleComparisonChange(i, j, 5 - k)}
                  checked={comparisons[i][j] === 5 - k}
                />
              {/each}
            </form>
            <p class="valik2">{choiceB}</p>
          </div>
        {/if}
      {/each}
    {/each}
  {/if}

  <Button on:click={handleNext}>Edasi</Button>
</section>

<style>
  section.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0.7;
  }

  .comparison {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 20px;
    text-align: end;
    width: 500px;
    align-self: center;
  }

  .valik2 {
    text-align: start;
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
</style>
