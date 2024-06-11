<!-- src/routes/CreateAccount.svelte -->
<script>
    import { supabase } from '$lib/supabaseClient';
  
    let first_name = '';
    let last_name = '';
    let email = '';
    let password = '';
  
    const createAccount = async () => {
      // Hash the password before sending it to Supabase
      const bcrypt = await import('bcryptjs');
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
  
      const { data, error } = await supabase
        .from('users')
        .insert([
          { first_name, last_name, email, pw_hash: passwordHash }
        ]);
  
      if (error) {
        console.error('Error:', error.message);
      } else {
        console.log('User created:', data);
      }
    };
  </script>
  
  <style>
    /* Add some basic styling */
    form {
      max-width: 400px;
      margin: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  
    input {
      padding: 10px;
      font-size: 1em;
    }
  
    button {
      padding: 10px;
      font-size: 1em;
      cursor: pointer;
    }
  </style>
  
  <form on:submit|preventDefault={createAccount}>
    <input type="text" bind:value={first_name} placeholder="First name" required />
    <input type="text" bind:value={last_name} placeholder="Last name" required />
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Create Account</button>
  </form>
  