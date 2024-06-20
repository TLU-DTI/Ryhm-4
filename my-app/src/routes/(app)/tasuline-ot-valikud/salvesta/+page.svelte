<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";
  import { premiumDecisionStore } from '../../../../store/premiumDecisionStore';
  import { criteriaStore } from '../../../../store/criteriaStore';
  import { supabase } from '$lib/supabaseClient';
  import { get } from 'svelte/store';
  import { sat_user_id } from '../../../../store.js';

  let premiumDecisionData = get(premiumDecisionStore);
  let userId = get(sat_user_id); // Get user_id directly from the store
  let premium_decision_id: number;

  console.log('Retrieved userId:', userId);

  async function saveToDatabase() {
    const dataToInsert = {
      choice_name: premiumDecisionData.decisionName,
      model_type: premiumDecisionData.modelType,
      choices: premiumDecisionData.choices,
      criteria: premiumDecisionData.criteria,
      user_id: userId
    };

    // Log the data being sent to the database
    console.log('Data being sent to the database:', dataToInsert);

    try {
      const { data, error } = await supabase
        .from('premium_decisions')
        .insert([dataToInsert])
        .select('id')
        .single();

      if (error) {
        throw new Error(error.message);
      } else {
        console.log('Data saved successfully');
        premium_decision_id = data.id; // Store the decision ID

        // Save premium_decision_id to session storage
        sessionStorage.setItem('premium_decision_id', premium_decision_id.toString());

        // Update the store with premium_decision_id
        criteriaStore.update(store => {
          store.premium_decision_id = premium_decision_id;
          console.log('Updated criteriaStore (salvesta):', store); // Log the store after update
          return store;
        });

        // Reset the project store
        premiumDecisionStore.resetStore();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function startAnswering() {
    await saveToDatabase();
    const criteriaStoreState = get(criteriaStore);
    console.log('Navigating to kriteeriumi-vordlus with id:', premium_decision_id);
    console.log('criteriaStore state before navigation:', criteriaStoreState);
    goto(`/tasuline-ot-valikud/kriteeriumi-vordlus/${premium_decision_id}`);
  }

  async function saveResult() {
    await saveToDatabase();
    goto("/");
  }

  function goBack() {
    goto("/tasuline-ot-valikud/valikud");
  }
</script>

<section class="container">
  <div class="input-container">
    <h2>Mida soovid edasi teha?</h2>
    <div class="buttons">
      <Button on:click={saveResult} on:keydown>Salvesta tulemus</Button>
      <Button style="secondary" on:click={goBack} on:keydown>Tagasi</Button>
      <Button on:click={startAnswering} on:keydown>Alusta vastamist</Button>
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

    .input-container {
        width: 600px;
        background-color: white;
        border-radius: 20px;
        padding: 50px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
        height: auto;
    }

    .buttons{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }

    .AHP{
        display: flex;
        margin-top: 50px;
        margin-bottom: 90px;
        justify-content: center;
        gap: 20px;
    }

    h2{
        font-size: 30px;
    }
    
    :global(.tooltip) {
        position: relative;
        padding-top: 0.35rem;
        cursor: pointer;
	}
	
	:global(#tooltip) {
		position: absolute;
		bottom: 100%;
		right: 0.78rem;
		transform: translate(50%, 0);
		padding: 0.2rem 0.35rem;
		background: #CFFFCB;
		border-radius: 0.25rem;
		filter: drop-shadow(0 1px 2px hsla(0, 0%, 0%, 0.2));
		width: 200px;
        padding: 8px 12px;
	}
	
	:global(.tooltip:not(:focus) #tooltip::before) {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		width: 0.6em;
		height: 0.25em;
		background: inherit;
		clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
	}
    
</style>