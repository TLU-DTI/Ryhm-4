<script lang="ts">
	import '$lib/auth_style.css';
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
	import { supabase } from '$lib/supabaseClient';
	import { useForm, validators, HintGroup, Hint, email, required } from "svelte-use-form";
	import { writable, derived } from 'svelte/store';
	import { sat_user_id } from '../../../store.js';
	import { tooltip } from "$lib/script/tooltip.js";
	import { goto } from "$app/navigation";

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
				])
					.select('id')
					.single();

			if (error) {
				throw new Error(error.message);
			}
			sat_user_id.set(supabaseData.id);
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
				<div class="mandatory">
					<Input type="text" name="username" placeholder="Nimi"></Input>
					<Hint for="username" on="required">*</Hint>
				</div>
				
				<div class="mandatory">
					<Input type="email" name="email" placeholder="Email"></Input>
					<Hint for="email" on="required">*</Hint>
					
				<HintGroup for="email">
					<div class="email-hint">
						<Hint on="email" hideWhenRequired><span use:tooltip={"E-mail ei ole korrektne!"}>*</span></Hint>
					</div>
				</HintGroup>

				</div>

				{#if $emailAlreadyUsed}
				<p style="color: red; font-size: 14px;">E-mail on juba kasutuses!</p>
				{/if}

				<div class="mandatory">
					<Input type="password" name="password" placeholder="Parool" bind:value={$password}></Input>
					<Hint for="password" on="required">*</Hint>
				</div>

				<div class="mandatory">
					<Input type="password" name="confirm_password" placeholder="Korda parooli"  bind:value={$confirmPassword}></Input>
					<Hint for="confirm_password" on="required">*</Hint>
				</div>

				{#if $showPasswordMismatch}
					<p style="color: red; font-size: 14px;">Paroolid ei ühti!</p>
				{/if}
	
				<button class="already-user" on:click={() => goto("/login")} on:keydown>
					<p>Kasutaja juba olemas?</p>
				</button>
			</div>

			
			<div class="reg-user">
				<Button style="secondary" on:click={() => goto("/login")} on:keydown>Tagasi</Button>
				<Button disabled={!$form.valid || !$passwordsMatch} on:click={() => goto("/completed")} on:keydown>Loo kasutaja</Button>
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

	.mandatory {
		display: flex;
		align-items: center;
		color: red;
		gap: 5px;
	}

	.already-user {
		margin-top: -20px;
		border: none;
		background-color: white;
	}

	.already-user p {
		text-decoration: underline;
		font-size: 14px;
		color: rgb(194, 192, 192);
	}

	.already-user p:hover {
        color: darkgreen;  
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
