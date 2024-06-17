<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import { tooltip } from "$lib/script/tooltip.js";
    import { goto } from "$app/navigation";
    import { get } from "svelte/store";
    import { premiumDecisionStore } from '../../../../store/premiumDecisionStore';

    let kriteeriumid = get(premiumDecisionStore).criteria.map(criteria => ({ title: criteria }));


    // Initialize inputs with values from the store
    let inputs = get(premiumDecisionStore).choices.map((choice, index) => ({ id: index + 1, value: choice }));

    function getTooltipContent() {
        return kriteeriumid.map(criteria => criteria.title).join(", ");
    }
    
    if (inputs.length === 0) {
        inputs = [{ id: 1, value: '' }, { id: 2, value: '' }];
    }

    const addInput = () => {
        inputs = [...inputs, { id: inputs.length + 1, value: '' }];
    };

    const removeInput = () => {
        if (inputs.length > 2) {
            inputs = inputs.slice(0, -1); 
        }
    };

    function saveChoices() {
        const choices = inputs.map(input => input.value).filter(value => value.trim() !== '');
        premiumDecisionStore.update(store => {
            return { ...store, choices };
        });
        goto("/tasuline-ot-valikud/finished");
    }
</script>

<section class="container">
    <div class="input-container">
        <h2>Sisesta objektid, mille vahel soovid valida:</h2>
        {#each inputs as input (input.id)}
            <div class="input-group">
                <p>valik:</p>
                <Input placeholder="Lisa uus valik" bind:value={input.value}></Input>  
                {#if inputs.length > 2}
                    <Button size="mini" on:click={removeInput}>-</Button>
                {/if}
            </div>
            <br>
        {/each}
        <div class="valkri">
            <div class="lisavalik">
                <p>Lisa veel valikuid</p>
                <Button size="mini" on:click={addInput}>+</Button>
            </div>
            <div class="lisaval">
                <p><span use:tooltip={getTooltipContent()}>Vaata lisatud valikuid</span></p>
            </div>            
        </div>
        <br>
        <div class="buttons">
            <Button style="secondary" on:click={() => goto("/tasuline-ot-valikud/sisesta-kriteeriumid")} on:keydown>Tagasi</Button>
            <Button on:click={saveChoices} on:keydown>Jätka</Button>
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

    .buttons {
        margin-top: 40px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }

    .input-container p {
        text-align: center;
        margin-right: 10px;
        font-size: 20px;
    }

    .lisavalik {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
    }

    h2 {
        font-size: 30px;
    }

    .lisavalik p {
        font-size: 15px;
    }

    .lisaval{
        margin-top: 20px;
        margin-right:10px;
	    color: rgb(194, 192, 192);
	    text-decoration: underline;
    }

    .valkri{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .lisaval p{
        font-size: 15px;
    }

</style>