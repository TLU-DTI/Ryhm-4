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
        <p>Vali otsuse mudel</p>
            <br>
            <div class="AHP">
                <Button style="secondary">Analüütiline hierarhia mudel</Button>
                <Button>?</Button>
            </div>
            <div class="buttons">
                    <Button style="secondary">Tagasi</Button>
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
        width: 500px;
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
    .buttons{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
    .AHP{
        display: flex;
        margin-top: 50px;
        margin-bottom: 90px;
        justify-content: center;
        gap: 20px;
        
    }

</style>