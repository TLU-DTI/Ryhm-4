<script lang="ts">
	import '$lib/auth_style.css';
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
	import { supabase } from '$lib/supabaseClient';
	import { useForm, validators, HintGroup, Hint, email, required } from "svelte-use-form";
	import { sat_user_id } from '../../../store.js';

	console.log($sat_user_id);


	const form = useForm();

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		const data = {
			email: formData.get('email') as string,
			password: formData.get('password') as string
		};

		try {
			// Fetch user from database by email
			const { data: user, error } = await supabase
				.from('users')
				.select('pw_hash, id')
				.eq('email', data.email)
				.single();

			if (error || !user) {
				throw new Error('Invalid email or password');
			}

			// Compare the provided password with the stored hashed password
			const bcrypt = await import('bcryptjs');
			const passwordMatch = await bcrypt.compare(data.password, user.pw_hash);


			if (!passwordMatch) {
				throw new Error('Invalid email or password');
			}

			sat_user_id.set(user.id);
			console.log('Login successful. The user: ' + user.id + ' logged in.');
			window.location.href = "/";//Muuda seda!
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>


<section>
	<div class="container">
		<div class="rectangle-left"> 
			<h1>Võta juhtimine enda kätte – <br><i>Decision Maker</i>.<br> Sinu teejuht paremate valikuteni!</h1>
		</div>

	<form use:form on:submit={handleLogin} class="rectangle-right">
		<div> 
			<div class="login-input">
				<Input type="email" name="email" placeholder="Email"></Input>
				<HintGroup for="email">
					<Hint on="required">This is a mandatory field</Hint>
					<Hint on="email" hideWhenRequired>Email is not valid</Hint>
				</HintGroup>

				<Input type="password" name="password" placeholder="Password"></Input>
				<Hint for="password" on="required">This is a mandatory field</Hint>

				<div class="forgot-password">
					<p>Unustasid salasõna?</p>
				</div>

			</div>

			<div class="reg-login">
				<Button style="secondary">Loo kasutaja</Button>
				<Button disabled={!$form.valid}>Logi sisse</Button>
			</div>

		</div>
	</form>
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
		text-decoration: underline;
		font-size: 14px;
		color: rgb(194, 192, 192); 
	}

	.forgot-password:hover {
		color: darkgreen;  
	}

	.reg-login {
		display: flex;
		justify-content: center;
		gap: 210px;
		margin-top: 50px;
	}
</style>