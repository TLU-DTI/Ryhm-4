<script lang="ts">
	import '$lib/auth_style.css';
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
	
	import { supabase } from '$lib/supabaseClient';
	import { useForm, validators, HintGroup, Hint, email, required } from "svelte-use-form";
	import { writable, derived } from 'svelte/store';

	const form = useForm();
	const password = writable('');
	const confirmPassword = writable('');

	const passwordsMatch = derived(
		[password, confirmPassword],
		([$password, $confirmPassword]) => $password === $confirmPassword
	);

	let showPasswordMismatch = writable(false);

	passwordsMatch.subscribe(value => {
		showPasswordMismatch.set(!value);
	});

	let emailAlreadyUsed = writable(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		
		const data = {
			name: formData.get('username') as string,
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			premium: false
		};

		try {
			// Check if the email already exists
			let { data: existingUser, error: existingUserError } = await supabase
				.from('users')
				.select('id')
				.eq('email', data.email)
				.single();

			if (existingUser) {
				emailAlreadyUsed.set(true);
				return;
			} else {
				emailAlreadyUsed.set(false);
			}

			// Hash the password
			const bcrypt = await import('bcryptjs');
			const saltRounds = 10;
			const passwordHash = await bcrypt.hash(data.password, saltRounds);

			// Send data to Supabase
			const { data: supabaseData, error } = await supabase
				.from('users')
				.insert([
					{
						name: data.name,
						email: data.email,
						pw_hash: passwordHash,
						premium: data.premium
					}
				]);

			if (error) {
				throw new Error(error.message);
			}

			console.log('User created:', supabaseData);
			window.location.href = "/";//Muuda seda!
		} catch (error) {
			console.error('Error:', error);
		}
	}

</script>

<section class="center-container">
	<form use:form on:submit={handleSubmit}>
		<div class="rectangle"> 
			<div class="reg-input">
					<h1>Kasutaja registreerimine</h1>
					<Input type="text" name="username" placeholder="Nimi"></Input>
					<Hint for="username" on="required">This is a mandatory field</Hint>

					<Input type="email" name="email" placeholder="Email"> </Input>
					<HintGroup for="email">
					  <Hint on="required">This is a mandatory field</Hint>
					  <Hint on="email" hideWhenRequired>Email is not valid</Hint>
					</HintGroup>

					{#if $emailAlreadyUsed}
					<p style="color: red;">Email is already used</p>
					{/if}

					<Input type="password" name="password" placeholder="Parool" bind:value={$password}></Input>
					<Hint for="password" on="required">This is a mandatory field</Hint>
				
					<Input type="password" name="confirm_password" placeholder="Korda parooli"  bind:value={$confirmPassword}></Input>
					<Hint for="confirm_password" on="required">This is a mandatory field</Hint>
				
					{#if $showPasswordMismatch}
						<p style="color: red;">Passwords do not match</p>
					{/if}
		
					<div class="already-user">
						<p>Kasutaja juba olemas?</p>
					</div>
			</div>

			<div class="reg-user">
				<Button style="secondary">Tagasi</Button>
				<Button disabled={!$form.valid || !$passwordsMatch}>Loo kasutaja</Button>
			</div>
		</div>
	</form>
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
		height: 640px; 
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
		margin-top: 30px;
		width: 100%; 
		display: flex;
		justify-content: center;
		gap: 210px;
	}
	.already-user {
		margin-top: -20px;
	}

	.already-user p {
		text-decoration: underline;
		font-size: 14px;
		color: rgb(194, 192, 192);
	}
	.already-user p:hover {
        color: darkgreen;  
	}
  
/**<form use:form on:submit={handleSubmit}>
	<h1>Register</h1>

	<input type="text" name="username" placeholder="Username" use:validators={[required]} />
	<Hint for="username" on="required">This is a mandatory field</Hint>

	<input type="email" name="email" placeholder="Email" use:validators={[required, email]} />
	<HintGroup for="email">
	  <Hint on="required">This is a mandatory field</Hint>
	  <Hint on="email" hideWhenRequired>Email is not valid</Hint>
	</HintGroup>
  
	{#if $emailAlreadyUsed}
		<p style="color: red;">Email is already used</p>
	{/if}

	<input type="password" name="password" placeholder="Password" use:validators={[required]} bind:value={$password} />
	<Hint for="password" on="required">This is a mandatory field</Hint>

	<input type="password" name="confirm_password" placeholder="Confirm Password" use:validators={[required]} bind:value={$confirmPassword} />
	<Hint for="confirm_password" on="required">This is a mandatory field</Hint>

	{#if $showPasswordMismatch}
		<p style="color: red;">Passwords do not match</p>
	{/if}
  
	<button disabled={!$form.valid || !$passwordsMatch}>Register</button>
</form>

<pre>
{JSON.stringify($form, null, " ")}
</pre>
  
<style>
	:global(.touched:invalid) {
		border-color: red;
		outline-color: red;
	}
</style> **/
