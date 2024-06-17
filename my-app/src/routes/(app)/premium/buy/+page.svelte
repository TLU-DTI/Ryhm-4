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
            <h2>Kas soovid osta tasulise versiooni?</h2>
            <br>
            <div class="buttons">
                <Button style="secondary" on:click={() => goto("/")} on:keydown>Loobu</Button>
                <Button on:click={() => goto("./makseviis")} on:keydown>Osta</Button>
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
    }

    .buttons{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }

</style>