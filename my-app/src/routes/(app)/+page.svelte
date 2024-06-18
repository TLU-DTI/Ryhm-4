<script>
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { sat_user_id } from '../../store.js';
    import Button from "$lib/components/Button.svelte";
    import choicesIcon from '$lib/images/choices.svg';
    import resultsIcon from '$lib/images/results.svg';
    import groupsIcon from '$lib/images/groups.svg';
    import { goto } from "$app/navigation";

    let FreeUserView = true;
    let loading = true;  // State to track loading status
    let currentUserId = null;

    function handleClick() {
        window.location.href = "/otsuse-tegija";
    }
    function handleClick2() {
        window.location.href = "/groups/create-group";
    }

    onMount(() => {
        sat_user_id.subscribe(value => {
            currentUserId = value;
            if (currentUserId == null) {
                window.location.href = "/login";
            } else {
                loading = false;  // Set loading to false if user is authenticated
            }
        });
    });
</script>

{#if loading}
    <p></p> 
{:else}
    <section>
        <div class="back-container">
            <div class="back-container-green">
                <img src={choicesIcon} alt="Choices icon" width="100px"/>
            </div>
            <div class="action-area">
                {#if FreeUserView}
                    <Button on:click={() => goto("/tasuta-ot-valikud")} on:keydown>Otsuse tegija</Button>
                {:else}
                    <Button on:click={() => goto("/tasuline-ot-valikud")} on:keydown>Otsuse tegija</Button>
                {/if}
            </div>
        </div>

        <div class="back-container">
            <div class="back-container-green">
                <img src={resultsIcon} alt="Results icon" width="100px"/>
            </div>
            <div class="action-area">    
                <Button on:click={() => goto("/tulemused")} on:keydown>Vaata tulemusi</Button> 
            </div>
        </div>

        <div class="back-container">
            <div class="back-container-green">
                <img src={groupsIcon} alt="Groups icon" width="100 px"/>
            </div>
            <div class="action-area">
                <Button on:click={handleClick2}>Grupi loomine</Button>
            </div>
        </div> 
    </section>
{/if}

<style>
    section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0.6;
        gap: 40px;
    }

    .back-container {
        display: grid;
        grid-template-rows: 1fr 1fr;
        min-width: 300px;
        max-width: 393px;
        height: 400px;
        flex-shrink: 0;
        border-radius: 38px;
        background: #FFF;
        box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.25);
        z-index: 1;
    }

    .back-container-green {
        display: grid;
        place-items: center;
        grid-template-columns: 1;
        width: 100%;
        height: 100%;
        flex-shrink: 0;
        border-radius: 38px 38px 0px 0px;
        background: #CFFFCB;
        z-index: 2;
    }

    .action-area {
        grid-template-columns: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: center;
        margin-bottom: 20px;
        height: 100%;
    }
</style>
