<script lang="ts">
	import '$lib/auth_style.css';
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
	import { supabase } from '$lib/supabaseClient';
	import { useForm, validators, HintGroup, Hint, email, required } from "svelte-use-form";
	import { sat_user_id, sat_username, sat_premium } from '../../../store.js';
	import { tooltip } from "$lib/script/tooltip.js";
	import { goto } from "$app/navigation";


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
				.select('pw_hash, id, name, premium')
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
			sat_username.set(user.name);
			sat_premium.set(user.premium);
			console.log('Login successful. The user: ' + user.id + ' logged in.');
			window.location.href = "/";//Muuda seda!
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>


<section class="container">
	<div class="rectangle-left"> 
		<h1>Võta juhtimine enda kätte – <br><i>Decision Maker</i>.<br> Sinu teejuht paremate valikuteni!</h1>
	</div>
	
	<div class="rectangle-right">
		<form use:form on:submit={handleLogin}>
			<div class="login-input">
				<div class="input-container mandatory">
					<Input type="email" name="email" placeholder="E-mail"></Input>
					<Hint for="email" on="required">*</Hint>
					<HintGroup for="email">
						<div class="email-hint">
							<Hint on="email" hideWhenRequired><span use:tooltip={"E-mail ei ole korrektne!"}>*</span></Hint>
						</div>
					</HintGroup>
				</div>

				<div class="input-container mandatory">
					<Input type="password" name="password" placeholder="Password"></Input>
					<Hint for="password" on="required">*</Hint>
				</div>
			</div>
			
		<button class="forgot-password" on:click={(event) => { event.preventDefault(); goto("/forgot-password"); }} on:keydown>
			<p>Unustasid salasõna?</p>
		</button>

		<div class="reg-login">
			<Button style="secondary" on:click={(event) => { event.preventDefault(); goto("/register"); }} on:keydown>Loo kasutaja</Button>
			<Button disabled={!$form.valid}>Logi sisse</Button>
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

	.input-container {
   	 	display: flex;
    	align-items: center;
    	position: relative;
    	margin-bottom: 10px;
	}

	.mandatory {
    	color: red;
    	gap: 5px;
	}
	.forgot-password {
		border: none;
		background-color: white;
	}

	.forgot-password p {
		margin-top: 20px;
		text-decoration: underline;
		font-size: 14px;
		color: rgb(194, 192, 192); 
	
	}

	.forgot-password p:hover {
		color: darkgreen;  
	}

	.reg-login {
		display: flex;
		justify-content: center;
		gap: 210px;
		margin-top: 50px;
		
	}

	:global(.tooltip) {
        white-space: nowrap;
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
		width: max-content;
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
