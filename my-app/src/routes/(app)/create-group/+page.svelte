<!-- src/routes/CreateGroup.svelte -->
<script lang="ts">
    import '$lib/styles.css';
    import { supabase } from '$lib/supabaseClient';
    import { useForm, validators, HintGroup, Hint, required } from "svelte-use-form";
    import { writable } from 'svelte/store';
    import { sat_user_id } from '../../../store.js';

    const form = useForm();

    console.log($sat_user_id);
    let currentUserId: number | null;
    sat_user_id.subscribe(value => {
        currentUserId = value;
    });  

    async function handleCreateGroup(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const data = {
            group_name: formData.get('group_name') as string,
            group_code: 'abc123'  // Hardcoded group code for now
        };

        try {
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .insert([
                    {
                        group_name: data.group_name,
                        group_code: data.group_code
                    }
                ])
                .select('id')
                .single();

            if (groupError) {
                throw new Error(groupError.message);
            }

            const groupId = groupData.id;

            const { error: userGroupError } = await supabase
                .from('users_groups')
                .insert([
                    {
                        user_ID: currentUserId,
                        group_ID: groupId
                    }
                ]);

            if (userGroupError) {
                throw new Error(userGroupError.message);
            }

            console.log('Group created and user added: ', groupData);
            window.location.href = "/your-groups";//Muuda seda!
        } catch (error) {
            console.error('Error:', error);
        }
    }
</script>

<form use:form on:submit={handleCreateGroup}>
    <h1>Create Group</h1>

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
