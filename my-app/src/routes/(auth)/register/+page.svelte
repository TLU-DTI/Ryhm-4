<script>
	import '$lib/auth_style.css';
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
</script>

<section class="center-container">
	<div class="rectangle"> 
		<div class="reg-input">
			<Input placeholder="Nimi"></Input>
			<Input placeholder="E-mail"></Input>
			<Input placeholder="Parool"></Input>
			<Input placeholder="Korda parooli"></Input>

			<div class="already-user">
				<a href="#">Kasutaja juba olemas?</a>
			</div>
		</div>

		<div class="reg-user">
			<Button style="secondary">Tagasi</Button>
			<Button>Loo kasutaja</Button>
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
		height: 600px; 
		background: white; 
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
		border-radius: 38px;
		padding: 40px 20px; 
		box-sizing: border-box; 
	}

	.reg-input {
		display: flex;
		flex-direction: column;
		gap: 30px; 
		width: 100%; 
		align-items: center; 
	}

	.reg-user {
		margin-top: 30px;
		width: 100%; 
		display: flex;
		justify-content: center;
		gap: 210px;
	}
	.already-user {
		margin-top: -20px;
	}

	.already-user a {
		text-decoration: none;
		font-size: 14px;
		color: black;
	}

	.already-user a:hover {
        color: rgb(100, 0, 40);    
    }

	.already-user a:visited {
        color: black;    
    }
</style>
