<script lang="ts">
	import '$lib/styles.css';

	import { useForm, validators, HintGroup, Hint, email, required } from "svelte-use-form";
	import { writable, derived } from 'svelte/store';

	const form = useForm();
	const password = writable('');
	const confirmPassword = writable('');

	const passwordsMatch = derived(
		[password, confirmPassword],
		([$password, $confirmPassword]) => $password === $confirmPassword
	);

	const showPasswordMismatch = derived(
		[passwordsMatch],
		([$passwordsMatch], set) => {
			if ($passwordsMatch) {
				set(false);
			} else {
				const timeoutId = setTimeout(() => {
					set(true);
				}, 3000);

				return () => clearTimeout(timeoutId);
			}
		},
		false
	);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		
		const data = {
			username: formData.get('username') as string,
			email: formData.get('email') as string,
			password: formData.get('password') as string
		};

		console.log('Username:', data.username);
		console.log('Email:', data.email);
		console.log('Password:', data.password);

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				throw new Error('Registration failed');
			}

			const result = await response.json();
			console.log('Registration successful:', result);
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>
  
<form use:form on:submit={handleSubmit}>
	<h1>Register</h1>

	<input type="text" name="username" placeholder="Username" use:validators={[required]} />
	<Hint for="username" on="required">This is a mandatory field</Hint>

	<input type="email" name="email" placeholder="Email" use:validators={[required, email]} />
	<HintGroup for="email">
	  <Hint on="required">This is a mandatory field</Hint>
	  <Hint on="email" hideWhenRequired>Email is not valid</Hint>
	</HintGroup>
  
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
</style>
