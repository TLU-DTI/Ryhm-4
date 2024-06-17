<script lang="ts">
	import '$lib/auth_style.css';
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
</script>

<section class="center-container">
	<div class="rectangle"> 
		<div class="reg-input">

			<h1>Unustasid salasõna?</h1>
			
			<Input type="email" name="email" placeholder="Email"></Input>

			<div class="mandatory">
				<Input type="password" name="password" placeholder="Parool" ></Input>
			</div>

			<div class="mandatory">
				<Input type="password" name="confirm_password" placeholder="Korda parooli" ></Input>
			</div>
		</div>
		
		<div class="reg-user">
			<Button style="secondary">Tagasi</Button>
			<Button>Salvesta</Button>
		</div>	
	</div>
</section>

<style>
	.center-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh; 
	}

	.rectangle {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 700px; 
		height: 540px; 
		background: white; 
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
		border-radius: 38px;
		padding: 40px 10px; 
		box-sizing: border-box; 
	}

	.reg-input {
		display: flex;
		flex-direction: column;
		gap: 25px; 
		width: 100%; 
		align-items: center; 
	}

	.reg-user {
		margin-top: 60px;
		width: 100%; 
		display: flex;
		justify-content: center;
		gap: 210px;
	}

	.mandatory {
		display: flex;
		align-items: center;
		color: red;
		gap: 5px;
	}

</style>
