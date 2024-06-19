<script>
	import '$lib/styles.css';
	import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";
    import kinnitatud from '$lib/images/kinnitatud.svg';
</script>

<section>
	<div class="container">
		<div class="rectangle-up"> 
			<img src={kinnitatud} alt="Õnnestus!" width="200" height="200">
		</div>

		<div class="rectangle-down"> 

			<div class="success">
				<p>Grupiga liitumine õnnestus!</p>
			</div>


			<div class="continue">
                <Button type="button" on:click={() => goto("/groups/your-groups")} on:keydown>Vaata oma gruppe</Button>
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
        align-items: center;
        width: 500px;
        height: 255px;
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
        width: 500px;
        height: 150px;
        background: white;
        border-bottom-left-radius: 38px;
        border-bottom-right-radius: 38px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    }

	.success {
		margin-top: -15px;
	}
</style>