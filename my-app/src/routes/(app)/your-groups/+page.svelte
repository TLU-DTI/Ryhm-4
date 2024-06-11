<!-- src/routes/CreateGroup.svelte -->
<script lang="ts">
    import '$lib/styles.css';
    import { supabase } from '$lib/supabaseClient';
    import { useForm, validators, HintGroup, Hint, email, required } from "svelte-use-form";
    import { writable } from 'svelte/store';

    const form = useForm();

    async function handleCreateGroup(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const data = {
            group_name: formData.get('group_name') as string,
            group_code: 'abc123'  // Hardcoded group code for now
        };

        try {
            const { data: supabaseData, error } = await supabase
                .from('groups')
                .insert([
                    {
                        group_name: data.group_name,
                        group_code: data.group_code
                    }
                ]);

            if (error) {
                throw new Error(error.message);
            }

            console.log('Group created:', supabaseData);
        } catch (error) {
            console.error('Error:', error);
        }
    }
</script>

<form use:form on:submit={handleCreateGroup}>
    <h1>Your Groups</h1>

    <input type="text" name="group_name" placeholder="Group Name" use:validators={[required]} />
    <Hint for="group_name" on="required">This is a mandatory field</Hint>

    <input type="text" name="group_code" placeholder="Group Code" value="abc123" readonly />

    <button disabled={!$form.valid}>Create Group</button>
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
