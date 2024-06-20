<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { get } from 'svelte/store';

  let code = null;
  let valikud = [];
  let kriteeriumid = [];
  let decisionId;

  onMount(async () => {
    const params = get(page).params;
    decisionId = params.id;

    const { data, error } = await supabase
      .from('premium_decision_results')
      .select('results')
      .eq('premium_decision_id', decisionId)
      .single();

    if (data) {
      const results = data.results;
      valikud = results.choiceWeights.map((weight, index) => ({ title: `Valik ${index + 1}`, per: weight }));
      kriteeriumid = results.criteriaWeights.map((weight, index) => ({ title: `kriteerium ${index + 1}`, per: weight }));
    }

    if (error) {
      console.error('Error fetching results:', error);
    }
  });
</script>

<section class="container">
  <div class="icontainer">
    <div class="header">
      <h2>Otsusemudeli nimi:</h2>
    </div>
    <div class="box">
      <div class="kritnimi">
        <h2>Kriteeriumite osakaal:</h2>
        {#each kriteeriumid as kriteerium }
          <div class="text" style="--percentage: {kriteerium.per}%">
            <p>{kriteerium.title}</p>
            <div class="percentage"><p>{kriteerium.per}%</p></div>
          </div>
        {/each}
      </div>
      <div class="tulemused">
        <h2>Tulemused:</h2>
        {#each valikud as valik }
          <div class="tulem" style="--percentage: {valik.per}%">
            <p>{valik.title}</p>
            <div class="percent"><p>{valik.per}%</p></div>
          </div>
        {/each}
      </div>
    </div>
    <br>
    <div class="buttons">
      <Button size="large" on:click={() => goto("/tulemused")} on:keydown>Lõpeta</Button>
    </div>
  </div>
</section>

<style>
    .buttons {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
    section.container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0.7;
    }
    .icontainer {
        background-color: white;
        border-radius: 20px;
        width: 1000px;
        height: 500px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); 
        padding-bottom: 110px;
    }

    .icontainer h2 {
        text-align: center;
        margin-right: 10px;
        font-size: 35px;
    }
    .header {
        padding: 15px;
    }

    .box {
        display: grid;
        grid-template-columns: 1fr 1fr;
        flex-direction: row;
        gap: 1px;
        align-items: center;
        place-items: center;
    }
    
    .kritnimi .text {
        background-color: white;
    }

    .kritnimi h2, .tulemused h2 {
        text-align: center;
        font-size: 25px;
        margin-top: 10px;
    }

    .kritnimi .text, .tulemused .tulem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        border-radius: 30px;
        width: 90%;
        padding: 0 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        height: 50px;
        position: relative;
        overflow: hidden;
    }

    .kritnimi .percentage, .tulemused .percent {
        margin-left: 70px;
        z-index: 1;
    }

    .kritnimi, .tulemused {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 30px;
        background-color: #F2F1E7;
        border-width: 1px;
        width: 400px;
        height: 360px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    }

    .kritnimi .text p, .tulemused .tulem p {
        margin: 0;
        text-align: center;
        font-size: 20px;
        z-index: 1;
    }

    .tulem{
        background-color: white;
    }

    .tulem::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0;
        background-color: #C4F1C0;
        z-index: 0;
        animation: fillAnimation 4s ease forwards;
    }

    .text{
        background-color:white;
    }

    .text::before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0;
        background-color: #C4F1C0;
        z-index: 0;
        animation: fillAnimation 4s ease forwards;
    }

    @keyframes fillAnimation {
        from {
            width: 0;
        }
        to {
            width: var(--percentage);
        }
    }
</style>
