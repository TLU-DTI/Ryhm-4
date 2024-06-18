<script lang="ts">
    import '$lib/styles.css';
    import { supabase } from '$lib/supabaseClient';
    import { useForm, validators, HintGroup, Hint, required } from "svelte-use-form";
    import { writable } from 'svelte/store';
    import { sat_user_id, sat_username, sat_premium } from '../../../../store.js';
    import { onMount } from 'svelte';

    const form = useForm();
    let loading = true;
    let currentUserId: number | null;

    function checkAuth() {
        sat_user_id.subscribe(value => {
            currentUserId = value;
            if ($sat_user_id == null) {
                window.location.href = "/login";
            } else if ($sat_premium == false){
                location.href = "/";
            } else {
                loading = false;
            }
        });
    }

    onMount(() => {
        checkAuth();
    });

    async function handleJoinGroup(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const groupCode = formData.get('group_code') as string;

        try {
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .select('id')
                .eq('group_code', groupCode)
                .single();

            if (groupError || !groupData) {
                throw new Error('Group not found');
            }

            const groupId = groupData.id;

            // Check if the user is already a member of the group
            const { data: userGroupData, error: userGroupCheckError } = await supabase
                .from('users_groups')
                .select('id')
                .eq('user_ID', currentUserId)
                .eq('group_ID', groupId)
                .single();

            if (userGroupCheckError && userGroupCheckError.code !== 'PGRST116') {
                throw new Error(userGroupCheckError.message);
            }

            if (userGroupData) {
                console.error('You are already a member of this group');
                return;
            }

            const { error: userGroupError } = await supabase
                .from('users_groups')
                .insert([
                    {
                        user_ID: currentUserId,
                        group_ID: groupId,
                        leader: false
                    }
                ]);

            if (userGroupError) {
                throw new Error(userGroupError.message);
            }

            console.log('User added to group: ', groupData);
            //window.location.href = "/your-groups";
        } catch (error) {
            console.error('Error:', error);
            alert(error); // Display error message to the user
        }
    }
</script>

{#if !loading}
    <form use:form on:submit={handleJoinGroup}>
        <h1>Join Group</h1>

        <input type="text" name="group_code" placeholder="Group Code" use:validators={[required]} />
        <Hint for="group_code" on="required">This is a mandatory field</Hint>

        <button disabled={!$form.valid}>Join Group</button>
    </form>

    <pre>
        {JSON.stringify($form, null, " ")}
    </pre>
{/if}

<style>
    :global(.touched:invalid) {
        border-color: red;
        outline-color: red;
    }
</style>
