<script>
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte"    
    import { goto } from "$app/navigation";
    

</script>
<svelte:head>
    <title>Otsuse Nimi Tasuta</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>
<section class="container">
    <div class="input-container">
        <h2>Anna oma otsusele nimi:</h2>
            <div class="input-name">
                <Input placeholder="Nimi"></Input> 
            </div>
            <br>
        <div class="buttons">
            <Button style="secondary" on:click={() => goto("/")} on:keydown>Tagasi</Button>
            <Button on:click={() => goto("/tasuta-ot-valikud/valikud")} on:keydown>Jätka</Button>
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
    .input-container {
        background-color: white;
        border-radius: 20px;
        padding: 50px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
    }

    .input-container p{
        text-align: center;
        margin-right: 10px;
        font-size: 25px;
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