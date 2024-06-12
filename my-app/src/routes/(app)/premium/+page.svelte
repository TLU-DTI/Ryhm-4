<script>
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";
</script>

<section class="container">
    <div class="input-container">
        <h2>Tasulise versiooni ostmine</h2>
        <p>Tasulise versiooniga on võimalik kasutada kõiki mudeleid, kui ka luua gruppe.</p> 
        <br>
        <div class="buttons">
            <Button style="secondary" on:click={() => goto("/")} on:keydown>Tagasi</Button>
            <Button on:click={() => goto("premium/buy")} on:keydown>Osta tasuline</Button>
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
        text-align: center;
    }

    .buttons{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }

</style>