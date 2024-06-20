<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";
  import { onMount, afterUpdate } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from "$app/stores";
  import { criteriaStore, updateChoiceComparisons, calculateFinalResults } from '../../../../../store/criteriaStore';

  let criteriaIndex: number = 0;
  let criteria: string = '';
  let choices: string[] = [];
  let comparisons: number[][] = [];
  let user_id: number;
  let premium_decision_id: number;

  function initializeData() {
    const store = get(criteriaStore);
    console.log('criteriaStore data on initializeData:', store);

    // Set user_id and premium_decision_id if they are not set
    if (!store.user_id) {
      store.user_id = user_id;
    }
    if (!store.premium_decision_id) {
      store.premium_decision_id = premium_decision_id;
    }

    if (criteriaIndex >= 0 && criteriaIndex < store.criteria.length) {
      criteria = store.criteria[criteriaIndex];
      choices = store.choices;

      // Initialize comparisons matrix if not already done
      comparisons = store.choicesComparisons[criteriaIndex]
        ? JSON.parse(JSON.stringify(store.choicesComparisons[criteriaIndex]))
        : Array(choices.length).fill(null).map(() => Array(choices.length).fill(null));
      
      console.log('Initialized comparisons:', comparisons);
    } else {
      console.warn('Invalid criteriaIndex:', criteriaIndex);
    }
  }

  afterUpdate(() => {
    const params = get(page).params;
    const newCriteriaIndex = parseInt(params.criteriaIndex, 10);
    if (criteriaIndex !== newCriteriaIndex) {
      console.log('afterUpdate: criteriaIndex updated to', newCriteriaIndex);
      criteriaIndex = newCriteriaIndex;
      initializeData();
    }
  });

  function handleComparisonChange(i: number, j: number, value: number) {
    console.log(`Updating comparison: criteriaIndex=${criteriaIndex}, i=${i}, j=${j}, value=${value}`);
    comparisons[i][j] = value;
    comparisons[j][i] = 6 - value;  // Assuming symmetrical comparison
    updateChoiceComparisons(criteriaIndex, i, j, value);
  }

  function handleNext() {
    // Store comparisons in criteriaStore
    criteriaStore.update(store => {
      store.choicesComparisons[criteriaIndex] = JSON.parse(JSON.stringify(comparisons));
      console.log('Updated criteriaStore with comparisons:', store.choicesComparisons);
      console.log('Criteria index', criteriaIndex);
      return store;
    });

    // Navigate to the next criteria or finish
    const store = get(criteriaStore);
    if (criteriaIndex < store.criteria.length - 1) {
      const nextCriteriaIndex = criteriaIndex + 1;  // Calculate next criteriaIndex before navigation
      goto(`/tasuline-ot-valikud/valiku-vordlus/${nextCriteriaIndex}`);
    } else {
      calculateFinalResults().then(() => {
        goto('/tulemused/tulemus'); // Assuming a results page
      });
    }
  }

  onMount(() => {
    const params = get(page).params;
    criteriaIndex = parseInt(params.criteriaIndex, 10);
    user_id = parseInt(params.user_id, 10); // Assuming user_id is passed as a param
    premium_decision_id = parseInt(params.premium_decision_id, 10); // Assuming premium_decision_id is passed as a param
    console.log('onMount: criteriaIndex set to', criteriaIndex);
    initializeData();
    console.log('criteriaStore data on onMount:', get(criteriaStore));
  });
</script>

<section class="container">
  <h2>Võrdle valikuid, kui kriteerium on:<br> {criteria}</h2>

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
