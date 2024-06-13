<script>
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import { goto } from "$app/navigation";

    let inputs = [{ id: 1 }, { id: 2 }]; //esialgsed inputi osad
    const addInput = () => {
        inputs = [...inputs, { id: inputs.length + 1 }]; //lisab uue inputi massiivi
    };
    const removeInput = () => {
        if (inputs.length > 2) {
            inputs = inputs.slice(0, -1); 
        }
    };
</script>

<section class="container">
    <div class="input-container">
        <h2>Sisesta objektid, mille vahel soovid valida:</h2>
        {#each inputs as input (input.id)}
            <div class="input-group">
                <p>valik:</p>
                <Input placeholder="Lisa uus valik"></Input>  <Button size="mini" on:click={removeInput}>-</Button>
            </div>
            <br>
        {/each}
            <div class="lisavalik">
                <p>Lisa veel valikuid</p>
                <Button size="mini" on:click={addInput}>+</Button>
            </div>
        <br>
        <div class="buttons">
            <Button style="secondary" on:click={() => goto("/tasuline-ot-valikud/otsusemudel")} on:keydown>Tagasi</Button>
            <Button on:click={() => goto("/tasuline-ot-valikud/sisesta-kriteeriumid")} on:keydown>Jätka</Button>
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
        height: auto;
        padding: 40px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .input-group {
        display: flex; /* sõna valik ja sisestusvälja jaoks */
        align-items: center; /* vertikaalne joondamine */
        gap: 20px;
    }

    .input-group p {
        margin-right: 10px; /* lisab ruumi sõna valik ja sisestusvälja vahele */
        font-size: medium;
    }

    .buttons{

        margin-top: 40px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }

    .input-container p{
        text-align: center;
        margin-right: 10px;
        font-size: 20px;
    }

    .lisavalik{
        margin-top: 20px;
        display: flex;
        flex-direction: row;
    }

    h2{
        font-size: 30px;
    }

    .lisavalik p{
        font-size: 15px;

    }
    
</style>




