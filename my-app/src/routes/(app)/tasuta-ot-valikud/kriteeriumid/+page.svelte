<script>
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import { page } from "$app/stores";

    let code = $page.url.searchParams.get("code");


</script>
<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>
<section class="container">
    <div class="button-container">
            <p>Millist valikut sa eelistad, kui kriteeriumiks on:</p>
        <div class="all-container">
            <div class="container2">
                {#if code === "0"}
                <div class="text">Mugavus</div>
                {:else}
                    {#if code === "1"}
                        <div class="text">Värv</div>
                    {/if}
                    {#if code === "2"}
                    <div class="text">Hind</div>
                    {/if}
                    {#if code === ""}
                    <div class="error-alert">Error!</div>
                    {/if}
                {/if}
            </div>
                <br>
                <div class="obj-button">
                    <Button>1. Valik</Button>
                    <Button>2. Valik</Button>
                </div>
        </div>
    
            <div class="buttons">
                <Button>Tagasi</Button>
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
        margin-bottom: 20px;
        font-weight: 800;
    }

.text {
    text-align: center;
    color: black;
    font-size: 20px;
}
.obj-button{
    width: 100%;
    margin-top: 40px;
    margin-bottom: 60px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
}

.error-alert {
    text-align: center;
    color: black;
    font-size: 30px;
    }

.all-container{
    width: 400px;
    height: 300px;
    padding: 20px;
    padding-bottom: 10px;
    margin-bottom: 30px;
    background: white;
    border-radius: 40px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}
</style>