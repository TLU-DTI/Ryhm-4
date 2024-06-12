<script lang="ts">
	import '$lib/styles.css';
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
  
<form use:form on:submit={handleLogin}>
	<h1>Login</h1>
  
	<input type="email" name="email" placeholder="Email" use:validators={[required, email]} />
	<HintGroup for="email">
		<Hint on="required">This is a mandatory field</Hint>
		<Hint on="email" hideWhenRequired>Email is not valid</Hint>
	</HintGroup>
  
	<input type="password" name="password" placeholder="Password" use:validators={[required]} />
	<Hint for="password" on="required">This is a mandatory field</Hint>
  
	<button disabled={!$form.valid}>Login</button>
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
