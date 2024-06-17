<script>
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";

    import { sat_user_id, sat_username, sat_premium } from '../../../../store.js';
    import { onMount } from 'svelte';

    let loading = true;

    onMount(() => {
        sat_user_id.subscribe(value => {
            if ($sat_user_id == null || $sat_premium == true) {
                window.location.href = "/login";
            } else {
                loading = false;
            }
        });
    });
</script>

{#if !loading}
    <section class="container">
        <div class="input-container">
            <h2>Vali makseviiis</h2>
            <div class="options">
                <Button style="secondary">GooglePay</Button>
                <Button style="secondary">Krediitkaart</Button>
                <Button style="secondary">Pangalink</Button>
            </div>
            <br>
            <div class="buttons">
                <Button style="secondary" on:click={() => goto("/")} on:keydown>Loobu</Button>
                <Button on:click={() => goto("./suunamine")} on:keydown>Osta</Button>
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
    }
    
    .options {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin: 20px;
    }

    .buttons{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }

</style>