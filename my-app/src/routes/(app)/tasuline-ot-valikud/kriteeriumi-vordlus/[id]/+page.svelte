<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from "$app/stores";
  import { criteriaStore, updateCriterionWeight } from '../../../../../store/criteriaStore';

  let code = null;
  let criteria = [];
  let criteriaWeights = [];
  let choiceWeights = [];

  const unsubscribe = criteriaStore.subscribe(value => {
      criteria = value.criteria || [];
      criteriaWeights = value.criteriaWeights || [];
      choiceWeights = value.choiceWeights || [];
  });

  onMount(() => {
      const urlCode = get(page).url.searchParams.get("code");
      if (urlCode) {
          code = parseInt(urlCode, 10);
      }
      const store = get(criteriaStore);
      if (!store.criteriaWeights.length && store.criteria.length) {
          criteriaStore.update(store => {
              store.criteriaWeights = Array(store.criteria.length).fill(100);
              return store;
          });
      }
  });

  function handleWeightChange(index, event) {
      const value = parseFloat(event.target.value);
      updateCriterionWeight(index, value);
  }
</script>

<section class="container">
  <div class="button-container">
      <h2>Anna kriteeriumitele osakaal:</h2>

      {#each criteria as criterion, index}
          <div class="criteria-weight">
              <label>{criterion}</label>
              <input
                  type="range"
                  min="0"
                  max="100"
                  bind:value={criteriaWeights[index]}
                  on:input={event => handleWeightChange(index, event)}
              />
              <span>{criteriaWeights[index]?.toFixed(0)}%</span>
          </div>
      {/each}

      <div class="results">
          <h2>Choice Weights:</h2>
          {#each choiceWeights as weight, index}
              <p>Choice {index + 1}: {weight.toFixed(0)}%</p>
          {/each}
      </div>

      <div class="buttons">
          <Button style="secondary" on:click={() => goto("/")}>Tagasi</Button>
          <Button on:click={() => goto("/tasuline-ot-valikud/valiku-vordlus/0")}>Jätka</Button>
      </div>
  </div>
</section>


<style>
  section.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0.7;
  }

  .button-container {
    background-color: white;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    padding: 50px;
    width: 1000px;
    height: auto;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    align-content: center;
    gap: 40px;
  }

  .criteria-weight {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .criteria-title {
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .form {
    display: grid;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 70%;
    place-self: center;
    border-radius: 20px;
  }

  .results {
    margin-top: 40px;
  }

  .buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }

  h2 {
    font-size: 30px;
  }
</style>
