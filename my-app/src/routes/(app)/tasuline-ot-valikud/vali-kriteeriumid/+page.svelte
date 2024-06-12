<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import { page } from "$app/stores";
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    let code: number | null = null

onMount(() => {
    const urlCode = get(page).url.searchParams.get("code");
    if (urlCode) {
        code = parseInt(urlCode, 10);
    }
});

let valikud: { title: string }[] = [
    { title: "Võrdne eelistus" },
    { title: "valik 1" },
    { title: "valik 2" },
    { title: "valik 3" }
];

let kriteeriumid: { title: string, lk: number }[] = [
    { title: "kriteerium1", lk: 1 },
    { title: "kriteerium2", lk: 2 },
    { title: "kriteerium3", lk: 3 }
];
</script>
<svelte:head>
    <title>Vali kriteeriumid</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>
<section class="container">
    <div class="button-container">
            <h2>Millist valikut sa eelistad, kui kriteeriumiks on:</h2>
            <br>
        <div class="all-container">
            <div class="container2">
                {#each kriteeriumid as kriteerium }
                    {#if code === kriteerium.lk}
                        <div class="text"><h3>{kriteerium.title}</h3></div>
                    {/if}
                {/each}
                <br>
        </div>
        <div class="button-group">
            {#each valikud as valik }
            <Button>{valik.title}</Button>
            {/each}
        </div>
            <div class="buttons">
                <Button style="secondary">Tagasi</Button>
                <br>
                <Button>Jätka</Button>
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
    .button-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
    }
    .buttons{
        width: 100%;
        margin-top: 20px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
    }       

    .container2 {
        width: 180px;
        height: 56px;
        background: #F2F1E7;
        border-radius: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-left: 100px;
        display: flex;
        padding-top: 18px;
    }

.all-container{
    width: 400px;
    height: auto;
    padding: 40px;
    padding-bottom: 10px;
    height: 100%;
    margin-bottom: 30px;
    background: white;
    border-radius: 40px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}
h3{
    font-size: 20px;
    text-align: center;
    font-weight: 200;
}
.button-group{
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    
}
h2{
    font-size: 30px;
    }
</style>