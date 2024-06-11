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
        <div class="mudelid">
            <div class="AHP">
                <Button>Analüütiline hierarhia mudel</Button>
                <Button>?</Button>
            </div>
            <div class="MC">
                <Button>Mitme kriteeriumi analüüs</Button>
                <Button>?</Button>
            </div>
            <div class="FC">
                <Button>Forced choice mudel</Button>
                <Button>?</Button>
            </div>
        </div>
            <div class="buttons">
                    <Button>Tagasi</Button>
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
        margin: 20px;
        justify-content: center;
        gap: 50px;
    }
    .MC{
        display: flex;
        margin: 20px;
        justify-content: center;
        gap: 50px;  
    }

</style>