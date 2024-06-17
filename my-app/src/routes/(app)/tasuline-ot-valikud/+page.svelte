<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import { goto } from "$app/navigation";
    import { supabase } from '$lib/supabaseClient';
	import { useForm, validators, HintGroup, Hint, email, required } from "svelte-use-form";
	import { writable, derived } from 'svelte/store';

    const form = useForm();
	
	async function handleSubmit(event: SubmitEvent) {
	event.preventDefault();
	const formData = new FormData(event.target as HTMLFormElement);

	const choiceName = formData.get('choice_name') as string; // Assuming your form field is named 'choice_name'

	try {
		// Check if the choice name already exists
		let { data: existingChoice, error: existingChoiceError } = await supabase
			.from('premium_decisions')
			.select('id')
			.eq('choice_name', choiceName)
			.single();

		if (existingChoice) {
			console.log(`Choice name '${choiceName}' already exists.`);
			return; // Handle this case appropriately (e.g., show error message)
		}

		// If the choice name doesn't exist, insert it
		const { data: insertedChoice, error: insertError } = await supabase
			.from('premium_decisions')
			.insert([{ choice_name: choiceName }])
			.single();

		if (insertedChoice) {
			console.log('Choice name inserted:', insertedChoice);
			// Handle success (e.g., redirect or show success message)
		}

		if (insertError) {
			throw new Error(insertError.message);
		}

	} catch (error) {
		console.error('Error:', error);
	}
}
</script>

<section class="container">
    <div class="input-container">
        <h2>Anna oma otsusele nimi:</h2>
        <form on:submit={handleSubmit}>
            <div class="input-name">
                <Input placeholder="Nimi"></Input> 
            </div>
            <br>
            <div class="buttons">
                <Button style="secondary" on:click={() => goto("/")} on:keydown>Tagasi
                </Button>
                <Button type="submit" on:click={() => goto("/tasuline-ot-valikud/otsusemudel")} on:keydown>Jätka</Button>
            </div>
        </form>
    </div>
</section>

<style>
    section.container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0.7;
    }

    .input-container {
        background-color: white;
        border-radius: 20px;
        padding: 50px;
        height: auto;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
    }

    .input-name {
        display: flex; /* sõna valik ja sisestusvälja jaoks */
        align-items: center; /* vertikaalne joondamine */
    }

    .buttons{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }

    h2{
        font-size: 30px;
    }
    
</style>