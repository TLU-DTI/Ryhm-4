<script>
	import '$lib/auth_style.css';
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
</script>

<section>
	<div class="container">
		<div class="rectangle-up"> 
			<img src="..\src\lib\images\free-verified-badge-1-866240.webp" alt="Õnnestus!" width="256" height="256">
		</div>

		<div class="rectangle-down"> 

			<div class="success">
				<p>Kasutaja loomine õnnestus!</p>
			</div>


			<div class="continue">
				<Button>Jätka rakenduses</Button>
			</div>

		</div>
	</div>

</section>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 180px;
    }

    .rectangle-up {
        display: flex;
        justify-content: center;
        width: 730px;
        height: 450px;
        background: #CFFFCB;
        border-top-left-radius: 38px;
        border-top-right-radius: 38px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    }

    .rectangle-down {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 730px;
        height: 450px;
        background: white;
        border-bottom-left-radius: 38px;
        border-bottom-right-radius: 38px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    }
</style>