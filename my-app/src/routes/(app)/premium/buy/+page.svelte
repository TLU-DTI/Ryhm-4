<script>
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";
</script>

<section class="container">
    <div class="input-container">
        <h2>Kas soovid osta tasulise versiooni?</h2>
        <br>
        <div class="buttons">
            <Button style="secondary" on:click={() => goto("/")} on:keydown>Loobu</Button>
            <Button on:click={() => goto("./makseviis")} on:keydown>Osta</Button>
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

    .buttons{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }

</style>