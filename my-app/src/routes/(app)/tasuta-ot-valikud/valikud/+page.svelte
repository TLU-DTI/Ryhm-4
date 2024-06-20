<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import { tooltip } from "$lib/script/tooltip.js";
    import { goto } from "$app/navigation";
    import { get } from "svelte/store";
    import { premiumDecisionStore } from '../../../../store/premiumDecisionStore';
    import { sat_decision_name, sat_decisions, sat_objects, sat_user_id } from '../../../../store.js';
    import { useForm, validators, required } from 'svelte-use-form';
    import { onMount } from 'svelte';

    function checkAuth() {
        sat_user_id.subscribe(value => {
            currentUserId = value;
            if ($sat_user_id == null) {
                window.location.href = "/login";
            } else {
                loading = false;
            }
        });
    }

    onMount(() => {
        checkAuth();
    });

    // Define types for inputs and criteria
    interface InputItem {
        id: number;
        value: string;
    }

    interface CriteriaItem {
        title: string;
    }

    let kriteeriumid: CriteriaItem[] = get(premiumDecisionStore).criteria.map((criteria: string) => ({ title: criteria }));

    // Initialize inputs with values from the store
    let inputs: InputItem[] = get(premiumDecisionStore).choices.map((choice: string, index: number) => ({ id: index + 1, value: choice }));

    const form = useForm();

    function getTooltipContent() {
        return kriteeriumid.map(criteria => criteria.title).join(", ");
    }
    
    if (inputs.length === 0) {
        inputs = [{ id: 1, value: '' }, { id: 2, value: '' }];
    }

    const addInput = () => {
        inputs = [...inputs, { id: inputs.length + 1, value: '' }];
    };

    const removeInput = () => {
        if (inputs.length > 2) {
            inputs = inputs.slice(0, -1); 
        }
    };

    // Subscribe to inputs changes and update sat_objects store
    $: sat_objects.set(inputs.map(input => input.value));

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        inputs.forEach(input => {
            formData.append(`input_${input.id}`, input.value);
        });
        try {
            // Add your form submission logic here
            console.log('Form submitted', Object.fromEntries(formData));
            window.location.href = "/tasuta-ot-valikud/kriteeriumid";
        } catch (error) {
            console.error('Error:', error);
        }
    }

    let loading = true;
    let currentUserId: number | null;
</script>

<svelte:head>
    <title>Otsuse Valikud Tasuta</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="container">
    {#if !loading}
        <form class="input-container" use:form on:submit={handleSubmit}>
            <h2>Sisesta objektid, mille vahel soovid valida:</h2>
            {#each inputs as input (input.id)}
                <div class="input-group">
                    <p>valik:</p>
                    <Input name={`input_${input.id}`} placeholder="Lisa uus valik" bind:value={input.value}></Input>  
                    {#if inputs.length > 2}
                        <Button size="mini" type="button" on:click={removeInput}>-</Button>
                    {/if}
                </div>
                <br>
            {/each}
            <div class="valkri">
                <div class="lisavalik">
                    <p>Lisa veel valikuid</p>
                    <Button size="mini" type="button" on:click={addInput}>+</Button>
                </div>         
            </div>
            <br>
            <div class="buttons">
                <Button style="secondary" type="button" on:click={() => goto("/tasuline-ot-valikud/sisesta-kriteeriumid")} on:keydown>Tagasi</Button>
                <Button type="submit" disabled={!$form.valid}>Jätka</Button>
            </div>
        </form>
    {/if}
</section>

<style>
    section.container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0.7;
    }

    .input-container {
        background-color: white;
        border-radius: 20px;
        padding: 50px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
        height: auto;
        gap: 8px;
    }

    .input-group {
        display: flex; /* sõna valik ja sisestusvälja jaoks */
        align-items: center; /* vertikaalne joondamine */
        gap: 20px;
    }

    .input-group p {
        margin-right: 10px; /* lisab ruumi sõna valik ja sisestusvälja vahele */
        font-size: medium;
    }

    .buttons {
        margin-top: 40px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }

    .input-container p {
        text-align: center;
        margin-right: 10px;
        font-size: 20px;
    }

    .lisavalik {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
    }

    h2 {
        font-size: 30px;
    }

    .lisavalik p {
        font-size: 15px;
    }

    .valkri{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
