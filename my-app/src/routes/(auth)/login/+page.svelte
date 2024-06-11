<script>
	import '$lib/auth_style.css';
	import Input from "$lib/components/Input.svelte";
</script>

<section>
	<div class="container">
		<div class="rectangle-left"> 
			<h1>Võta juhtimine enda kätte – <br><i>Decision Maker</i>.<br> Sinu teejuht paremate valikuteni!</h1>
		</div>
		<div class="rectangle-right"> 
			<div class="login-input">
				<Input></Input>
				<Input></Input>
			</div>
		</div>
	</div>
</section>

<style>
	.container {
		display: flex;
        justify-content: center;
        align-items: center;
		padding: 160px;
	}

	h1 {
		padding: 70px;
		text-align: left;
		align-content: center;
		font-size: 40px;
	}

	.rectangle-left {
		display: flex;
		width: 730px; 
		height: 500px; 
		background: #CFFFCB; 
		border-top-left-radius: 38px; 
		border-bottom-left-radius: 38px;
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
	}

	.rectangle-right {
		display: flex;
		width: 730px; 
		height: 500px; 
		background: white; 
		border-top-right-radius: 38px; 
		border-bottom-right-radius: 38px;
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
	}

</style>