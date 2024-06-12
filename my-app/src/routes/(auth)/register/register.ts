	import '$lib/styles.css';
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