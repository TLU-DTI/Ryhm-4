<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import { tooltip } from "$lib/script/tooltip.js";
    import { goto } from "$app/navigation";

    let valikud: { title: string }[] = [
        { title: "valik 1" },
        { title: "valik 2" },
        { title: "valik 3" }
    ];

    function getTooltipContent() {
        return valikud.map(valik => valik.title).join(", ");
    }

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
        <h2>Sisesta kriteeriumid, mida võrrelda:</h2>
        {#each inputs as input (input.id)}
            <div class="input-group">
                <p>kriteerium:</p>
                <Input placeholder="Lisa uus kriteerium"></Input>  <Button size="mini" on:click={removeInput}>-</Button>
            </div>
            <br>
        {/each}
            <div class="valkri">
                <div class="lisakriteerium">
                    <p>Lisa veel kriteeriume</p>
                    <Button size="mini" on:click={addInput}>+</Button>
                </div>
                <div class="lisaval">
                    <p><span use:tooltip={getTooltipContent()}>Vaata lisatud valikuid</span></p>
                </div>            
            </div>
            <br>
            <div class="buttons">
                <Button style="secondary" on:click={() => goto("/tasuline-ot-valikud/valikud")} on:keydown>Tagasi</Button>
                <Button on:click={() => goto("/tasuline-ot-valikud/vali-kriteeriumid")} on:keydown>Jätka</Button>
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
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
        height: auto;
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

    h2{
        font-size: 30px;
    }

    :global(.tooltip) {
        position: relative;
        padding-top: 0.35rem;
        cursor: pointer;
	}
	
	:global(#tooltip) {
        position: absolute;
        bottom: 100%;
        right: 50%;
        transform: translate(50%, 0);
        color: black;
        padding: 8px 12px;
        background: #CFFFCB;
        border-radius: 0.25rem;
        filter: drop-shadow(0 1px 2px hsla(0, 0%, 0%, 0.2));
        width: 150px;
        text-align: center;
    }

	:global(.tooltip:not(:focus) #tooltip::before) {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		width: 0.6em;
		height: 0.25em;
		background: inherit;
		clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
	}
    
    .lisakriteerium{
        margin-top: 20px;
        display: flex;
        flex-direction: row;
    }

    .lisakriteerium p{
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