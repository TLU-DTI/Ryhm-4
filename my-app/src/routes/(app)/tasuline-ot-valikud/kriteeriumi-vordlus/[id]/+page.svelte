<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from "$app/stores";
  import { criteriaStore, updateCriteriaMatrix, calculateCriteriaWeights } from '../../../../../store/criteriaStore';

  let code: number | null = null;

  onMount(() => {
    const urlCode = get(page).url.searchParams.get("code");
    if (urlCode) {
      code = parseInt(urlCode, 10);
    }
  });

  $: criteria = $criteriaStore.criteria || [];
  $: criteriaMatrix = $criteriaStore.criteriaMatrix || [];
  $: criteriaWeights = $criteriaStore.criteriaWeights || [];
  $: criteriaPercentages = $criteriaStore.criteriaPercentages || [];
</script>

<section class="container">
  <div class="button-container">
    <h2>Milline on Sinu valik, kui kriteeriumiks on:</h2>

    {#each criteriaMatrix as row, i}
      {#each row as cell, j}
        {#if i > j}
          <div class="criteria-comparison">
            <div class="criteria-title">
              <span>{criteria[i]}</span>
              <form class="likert-form">
                {#each Array(5) as _, k}
                  <input
                    type="radio"
                    name="likert-{i}-{j}"
                    value="{5 - k}"
                    on:change={() => updateCriteriaMatrix(i, j, 5 - k)}
                    checked={cell === 5 - k}
                  >
                {/each}
              </form>
              <span>{criteria[j]}</span>
            </div>
          </div>
        {/if}
      {/each}
    {/each}

    <div class="results">
      <h2>Criteria Weights:</h2>
      {#each criteriaWeights as weight, index}
        <p>{criteria[index]}: {weight.toFixed(2)}</p>
      {/each}

      <h2>Criteria Percentages:</h2>
      {#each criteriaPercentages as percentage, index}
        <p>{criteria[index]}: {percentage.toFixed(2)}%</p>
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

  .criteria-comparison {
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

  .likert-form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 20px;
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