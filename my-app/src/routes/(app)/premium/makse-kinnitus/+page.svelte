<script>
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";

    import { sat_user_id, sat_username, sat_premium } from '../../../../store.js';
    import { onMount } from 'svelte';

    let loading = true;

    onMount(() => {
        sat_user_id.subscribe(value => {
            if ($sat_user_id == null) {
                window.location.href = "/login";
            } else if ($sat_premium == true){
                location.href = "/";
            } else {
                loading = false;
            }
        });
    });
</script>

{#if !loading}
    <section class="container">
        <div class="input-container">
            <h2>Teie makse on edukalt sooritatud!</h2>
            <p>Saate alustada nüüd tasulise rakenduse kasutamist!</p>
            <br>
            <div class="buttons">
                <Button on:click={() => goto("/")} on:keydown>Pealehele</Button>
            </div>
        </div>
    </section>
{/if}

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
        width: 400px;
        text-align: center;
    }
    
    .buttons{
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }

</style>