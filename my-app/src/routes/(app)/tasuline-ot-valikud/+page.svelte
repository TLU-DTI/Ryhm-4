<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import { goto } from "$app/navigation";
    import { supabase } from '$lib/supabaseClient';
    import { useForm } from "svelte-use-form";
    import { writable } from 'svelte/store';
    import { premiumDecisionStore } from '../../../store/premiumDecisionStore';

    const form = useForm();
    let decisionName = '';

    premiumDecisionStore.subscribe(store => {
        decisionName = store.decisionName;
    });

    function savedecisionName() {
        premiumDecisionStore.update(store => {
            return { ...store, decisionName };
        });
        goto("/tasuline-ot-valikud/otsusemudel");
    }
</script>

<section class="container">
    <div class="input-container">
        <h2>Anna oma otsusele nimi:</h2>
        <form on:submit|preventDefault={savedecisionName}>
            <div class="input-name">
                <Input placeholder="Nimi" bind:value={decisionName}></Input> 
            </div>
            <br>
            <div class="buttons">
                <Button style="secondary" on:click={() => goto("/")} on:keydown>Mine tagasi
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