<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte"    
    import { goto } from "$app/navigation";
    import { sat_decision_name, sat_decisions, sat_objects, sat_user_id } from '../../../store.js';
    import { useForm, validators, HintGroup, Hint, required } from "svelte-use-form";
    import { onMount } from 'svelte';


    const form = useForm();
    let loading = true;
    let currentUserId: number | null;

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

    type DesicionData = {
        desicion_name: string;
    };

    async function handleCreateDesicion(event: SubmitEvent) {
        const formData = new FormData(event.target as HTMLFormElement);
            const data: DesicionData = {
                desicion_name: formData.get('desicion_name') as string
            };
        try {
                sat_decision_name.set(data.desicion_name);
                
                window.location.href = "/tasuta-ot-valikud/valikud";
        }

        catch (error) {
            console.error('Error:', error);
        }
    }
    

</script>

<svelte:head>
    <title>Otsuse Nimi Tasuta</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="container">
    {#if !loading}
        <form class="input-container" use:form on:submit={handleCreateDesicion}>
            <h2>Anna oma otsusele nimi:</h2>
                <div class="input-name">
                    <Input name="desicion_name" placeholder="Nimi"></Input> 
                </div>
            <br>
            <div class="buttons">
                <Button style="secondary" on:click={() => goto("/")} on:keydown>Tagasi</Button>
                <Button disabled={!$form.valid}>Jätka</Button>
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
    }
    .input-name {
        display: flex; /* sõna valik ja sisestusvälja jaoks */
        align-items: center; /* vertikaalne joondamine */
    }
    .buttons{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
    h2{
        font-size: 30px;
    }

</style>