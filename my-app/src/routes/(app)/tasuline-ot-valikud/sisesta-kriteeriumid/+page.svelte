<script>
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import choicesIcon from '$lib/images/choices.svg';
    import resultsIcon from '$lib/images/results.svg';
    import groupsIcon from '$lib/images/groups.svg';
    import { onMount } from 'svelte';

</script>
<svelte:head>
    <title>Sisesta kriteeriumid</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>
<section class="container">
    <div class="input-container">
        <h2>Sisesta kriteeriumid, mida võrrelda:</h2>
        <div class="input-group">
            <div class="inputs">
                <div class="kriteerium1">
                    <p>1. Kriteerium:</p>
                    <Input placeholder=""></Input> 
                </div>
                <div class="kriteerium2">
                    <p>2. kriteerium:</p>
                    <Input placeholder=""></Input> 
                </div>
                <div class="lisakriteerium">
                    <div class="lisakr"><p>Lisa kriteerium</p>
                        <Button size="small">+</Button></div> 
                    <div class="lisaval">
                    <p>Vaata lisatud valikuid</p>
                    </div>
                </div>
        </div>
        </div>
            <br>
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
        margin: 30px;
    }
    .kriteerium1{
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
    }
    .kriteerium2{
        display: flex;
        flex-direction: row;
        margin-top: 10px;
    }
    .lisakriteerium{
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    h2{
        font-size: 30px;
    }
    .lisakriteerium p{
        font-size: 15px;
    }
    .lisakr{
        display: flex;
        gap: 10px;
    }
    .lisaval{
        margin-right: 10px;
        color: rgb(194, 192, 192);
        text-decoration: underline;
    }


</style>