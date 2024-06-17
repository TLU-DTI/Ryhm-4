<script>
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";
</script>

<section class="container">
    <div class="button-container">
        <div class="button-name">

        </div>
        <br>
        <div class="buttons">
            <Button style="secondary" on:click={() => goto("/")} on:keydown>Tagasi
            </Button>
            <Button on:click={() => goto("/tasuline-ot-valikud/otsusemudel")} on:keydown>Jätka</Button>
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
        background-color: white;
        border-radius: 20px;
        padding: 50px;
        height: auto;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
    }

    .button-name {
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