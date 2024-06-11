<script>
	import '$lib/auth_style.css';
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
</script>

<section>
	<div class="container">
		<div class="rectangle-left"> 
			<h1>Võta juhtimine enda kätte – <br><i>Decision Maker</i>.<br> Sinu teejuht paremate valikuteni!</h1>
		</div>

		<div class="rectangle-right"> 
			<div class="login-input">
				<Input placeholder="Email"></Input>
				<Input placeholder="Parool"></Input>
				<div class="forgot-password">
					<a href="#">Unustasid salasõna?</a>
				</div>
			</div>

			<div class="reg-login">
				<Button style="secondary">Loo kasutaja</Button>
				<Button>Logi sisse</Button>
			</div>

		</div>
	</div>

</section>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 180px;
	}

	h1 {
		padding: 70px;
		padding-top: 95px;
		text-align: left;
		font-size: 40px;
	}

	.rectangle-left {
		display: flex;
		justify-content: center;
		width: 730px; 
		height: 450px; 
		background: #CFFFCB; 
		border-top-left-radius: 38px; 
		border-bottom-left-radius: 38px;
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
	}

	.rectangle-right {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 730px; 
		height: 450px; 
		background: white; 
		border-top-right-radius: 38px; 
		border-bottom-right-radius: 38px;
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
	}

	.login-input {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.forgot-password {
		margin-top: -20px;
	}

	.forgot-password a {
		text-decoration: none;
		font-size: 14px;
	}

	.reg-login {
		display: flex;
		justify-content: center;
		gap: 230px;
		margin-top: 50px;
	}
</style>
