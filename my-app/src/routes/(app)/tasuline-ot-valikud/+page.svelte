<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import { goto } from "$app/navigation";
    import { supabase } from '$lib/supabaseClient';
    import { useForm } from "svelte-use-form";
    import { writable } from 'svelte/store';
    import { premiumDecisionStore } from '../../../store/premiumDecisionStore';
    import { sat_decision_name, sat_decisions, sat_objects, sat_user_id } from '../../../store.js';
    import { onMount } from 'svelte';

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

    const form = useForm();
    let decisionName = '';

    premiumDecisionStore.subscribe(store => {
        decisionName = store.decisionName;
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
                premiumDecisionStore.update(store => {
                return { ...store, decisionName };
            }); 
            goto("/tasuline-ot-valikud/otsusemudel");
            }

        catch (error) {
            console.error('Error:', error);
        }
    }
</script>

<section class="container">
    <div class="input-container">
        <h2>Anna oma otsusele nimi:</h2>
        <form on:submit|preventDefault={handleCreateDesicion}>
            <div class="input-name">
                <Input name="desicion_name" placeholder="Nimi" bind:value={decisionName}></Input> 
            </div>
            <br>
            <div class="buttons">
                <Button style="secondary" on:click={(event) => { event.preventDefault(); goto("/"); }} on:keydown>Tagasi
                </Button>
                <Button type="submit" on:keydown>Jätka</Button>
            </div>
        </form>
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
        background-color: white;
        border-radius: 20px;
        padding: 50px;
        height: auto;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
    }

    .input-name {
        display: flex; /* sõna valik ja sisestusvälja jaoks */
        align-items: center; /* vertikaalne joondamine */
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