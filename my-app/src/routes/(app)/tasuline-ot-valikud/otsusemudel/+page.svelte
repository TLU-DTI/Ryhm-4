<script>
    import Button from "$lib/components/Button.svelte";
    import { tooltip } from "$lib/script/tooltip.js";
    import { goto } from "$app/navigation";
</script>

<section class="container">
    <div class="input-container">
        <h2>Vali otsuse mudel:</h2>
        <br>
        <div class="AHP">
            <Button style="secondary" size="large">Analüütiline hierarhia mudel
            </Button>
            <Button size="mini">
                <span use:tooltip= {"Otsustusmudel, kus kasutajad võrdlevad alternatiive iga kriteeriumi alusel paarikaupa. Näiteks kui kriteeriumiks on hind, siis kumb on odavam, kas Ford või BMW? BMW või Audi, Audi või Ford jne.  Kõige rohkem punkte kogunud kandidaat osutub valituks."}>?</span>
            </Button>
        </div>
        <div class="buttons">
            <Button style="secondary" on:click={() => goto("/tasuline-ot-valikud")} on:keydown>Tagasi</Button>
            <Button on:click={() => goto("/tasuline-ot-valikud/valikud")} on:keydown>Jätka</Button>
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
        height: auto;
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
		right: 0.78rem;
		transform: translate(50%, 0);
		padding: 0.2rem 0.35rem;
		background: #CFFFCB;
		border-radius: 0.25rem;
		filter: drop-shadow(0 1px 2px hsla(0, 0%, 0%, 0.2));
		width: 200px;
        padding: 8px 12px;
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
    
</style>