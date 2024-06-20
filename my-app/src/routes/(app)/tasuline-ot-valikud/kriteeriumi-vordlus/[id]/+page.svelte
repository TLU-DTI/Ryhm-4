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
  let premium_decision_id;

  criteriaStore.subscribe(value => {
    criteria = value.criteria || [];
    criteriaWeights = value.criteriaWeights || [];
    choiceWeights = value.choiceWeights || [];
    console.log('Subscribed criteriaStore:', value);
  });

  onMount(() => {
    const urlCode = get(page).url.searchParams.get("code");
    if (urlCode) {
      code = parseInt(urlCode, 10);
    }

    // Retrieve premium_decision_id from session storage
    const storedPremiumDecisionId = sessionStorage.getItem('premium_decision_id');
    if (storedPremiumDecisionId) {
      premium_decision_id = parseInt(storedPremiumDecisionId, 10);
      criteriaStore.update(store => {
        store.premium_decision_id = premium_decision_id;
        return store;
      });
    }

    const store = get(criteriaStore);
    console.log('onMount criteriaStore:', store);
    if (!store.criteriaWeights.length && store.criteria.length) {
      criteriaStore.update(store => {
        store.criteriaWeights = Array(store.criteria.length).fill(100);
        return store;
      });
    }

    // Check if premium_decision_id is undefined
    if (!premium_decision_id) {
      console.error('premium_decision_id is undefined in kriteeriumi-vordlus page');
    } else {
      console.log('premium_decision_id in kriteeriumi-vordlus page:', premium_decision_id);
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
              <input class='slider'
                  type="range"
                  min="0"
                  max="100"
                  bind:value={criteriaWeights[index]}
                  on:input={event => handleWeightChange(index, event)}
              />
              <span>{criteriaWeights[index]?.toFixed(0)}%</span>
          </div>
      {/each}

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
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 20px;
    text-align: end;
    width: 500px;
    align-self: center;
  }

  .protsent {
    text-align: start;
  }

  .buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }

</style>
