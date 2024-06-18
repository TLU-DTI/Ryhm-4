<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { page } from '$app/stores';
    let code: number | null = null

    onMount(() => {
    const urlCode = get(page).url.searchParams.get("code");
    if (urlCode) {
        code = parseInt(urlCode, 10);
    }
    });

    let tulemused: { title: string}[] = [
        { title: "Autode valimine" },
        { title: "Aiamööbel" },
        { title: "Puhkuse reis" },
        { title: "Õhtusöök" }
    ];

</script>

<section class="container">
    <div class="button-container">
        <h2>Millise otsuse tegija tulemust soovid näha?</h2>
        <div class="button-name">
            <div class="tulemid">
                {#each tulemused as tulemus}
                <div class="nupp"><Button>{tulemus.title}</Button>
                </div>
                {/each}
            </div>
            <br>
        </div>
        <div class="buttons">
            <Button style="secondary" on:click={() => goto("/")} on:keydown>Tagasi
            </Button>
            <Button on:click={() => goto("/tulemused/tulemus?code=1")} on:keydown>Jätka</Button>
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
    .nupp {
        border-radius: 30px;
        border-width: 10px;
        width: 390px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
    }

    .button-container {
        background-color: white;
        border-radius: 20px;
        padding: 50px;
        height: auto;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
    }

    .button-name {
        display: flex; 
        align-items: center; 
    }

    .buttons{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }

    h2{
        font-size: 30px;
    }
    .tulemid{
        display: flex;
        margin-bottom: 10px;
        flex-direction: column;
        gap: 1px;
        align-items: center;
        justify-content: center;
        margin-left: 60px;
    }
    
</style>