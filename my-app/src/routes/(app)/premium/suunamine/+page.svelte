<script lang="ts">
    import '$lib/auth_style.css';
    import Input from "$lib/components/Input.svelte";
    import Button from "$lib/components/Button.svelte";
    import { supabase } from '$lib/supabaseClient';
    import { useForm, validators, HintGroup, Hint, email, required } from "svelte-use-form";
    import { writable, derived } from 'svelte/store';
    import { sat_user_id, sat_premium } from '../../../../store.js';
    import { tooltip } from "$lib/script/tooltip.js";
    import { onMount } from 'svelte';

    let loading = true;

    onMount(() => {
        sat_user_id.subscribe(value => {
            if ($sat_user_id == null || $sat_premium == true) {
                window.location.href = "/login";
            } else {
                loading = false;
            }
        });
    });


    const form = useForm();
    let userId: number | null;

    // Subscribe to sat_user_id to get the current user ID
    sat_user_id.subscribe(value => {
        userId = value;
    });

    async function submit(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        
        const data = {
            firstName: formData.get('first-name') as string,
            lastName: formData.get('last-name') as string,
            email: formData.get('email') as string,
            cardNumber: formData.get('card-number') as string,
            expirationDate: formData.get('expiration-date') as string,
            cvv: formData.get('cvv') as string
        };

        try {

            // Update the user's premium status in the database
            const { error } = await supabase
                .from('users')
                .update({ premium: true })
                .eq('id', userId);

            if (error) {
                console.log(error);
                throw new Error(error.message);
            }

            sat_premium.set(true);

            console.log('User premium status updated');
            window.location.href = "/premium/makse-kinnitus"; // Redirect after successful update
        } catch (error) {
            console.error('Error:', error);
        }
    }
</script>

{#if !loading}
    <section class="container">
        <form class="input-container" use:form on:submit={submit}>
            <h2>Maksa krediitkaardiga</h2>
            <br>
            <div class="input-field">
                <label for="first-name">Eesnimi</label>
                <Input type="text" name="first-name" placeholder="Eesnimi"></Input>
            </div>
            <div class="input-field">
                <label for="last-name">Perekonnanimi</label>
                <Input type="text" name="last-name" placeholder="Perekonnanimi"></Input>
            </div>
            <div class="input-field">
                <label for="email">E-posti aadress</label>
                <Input type="email" name="email" placeholder="E-posti aadress"></Input>
            </div>
            <div class="input-field">
                <label for="card-number">Kaardi number</label>
                <Input type="text" name="card-number" placeholder="1234 5678 9012 3456"></Input>
            </div>
            <div class="input-field">
                <label for="expiration-date">Aegumiskuupäev</label>
                <Input type="text" name="expiration-date" placeholder="MM/YY"></Input>
            </div>
            <div class="input-field">
                <label for="cvv">CVV</label>
                <Input type="text" name="cvv" placeholder="123"></Input>
            </div>
            <div class="buttons">
                <Button style="secondary" type="submit" disabled={!$form.valid}>Jätka</Button>
            </div>
        </form>
    </section>
{/if}

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
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
        width: 400px;
    }

    .input-field {
        margin-bottom: 20px;
    }

    .input-field label {
        display: block;
        margin-bottom: 5px;
    }

    .input-field input {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
    }

    .buttons {
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }
</style>
