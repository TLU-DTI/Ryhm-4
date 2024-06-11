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
        <p>Anna oma otsusele nimi</p>
            <div class="input-name">
                <Input placeholder=""></Input> 
            </div>
            <br>
        <div class="buttons">
                <Button style="second">Tagasi</Button>
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

</style>