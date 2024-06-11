<script>
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import choicesIcon from '$lib/images/choices.svg';
    import resultsIcon from '$lib/images/results.svg';
    import groupsIcon from '$lib/images/groups.svg';
    import { onMount } from 'svelte';

</script>
<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>
<section class="container">
    <div class="input-container">
        <p>Sisesta objektid, mille vahel soovid valida</p>
        <div class="input-group">
            <div class="inputs">
                <div class="valik1">
                    <p>1. Valik:</p>
                    <Input placeholder=""></Input> 
                </div>
                <div class="valik2">
                    <p>2. Valik:</p>
                    <Input placeholder=""></Input> 
                </div>
        </div>
        </div>
            <br>
            <div class="buttons">
                <Button style="secondary" size="large">Tagasi</Button>
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
    .input-container {
        background-color: white;
        border-radius: 20px;
         padding: 40px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
        display: flex;
        flex-direction: column
        ;
    }
    .input-group {
        display: flex; /* sõna valik ja sisestusvälja jaoks */
        align-items: center; /* vertikaalne joondamine */
    }
    .input-group p {
        margin-right: 10px; /* lisab ruumi sõna valik ja sisestusvälja vahele */
        font-size: medium;
    }
    .buttons{
        margin-top: 20px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }
    .input-container p{
        text-align: center;
        margin-right: 10px;
        font-size: 20px;
    }
    .inputs{
        display: flex;
        flex-direction: column;
    }
    .valik1{
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
    }
    .valik2{
        display: flex;
        flex-direction: row;
        margin-top: 10px;
    }
</style>