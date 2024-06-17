<script lang="ts">
    import '$lib/styles.css';
    import { supabase } from '$lib/supabaseClient';
    import { useForm, validators, HintGroup, Hint, required } from "svelte-use-form";
    import { writable } from 'svelte/store';
    import { sat_user_id, sat_premium } from '../../../store.js';
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

    function handleClick() {
        window.location.href = "/otsuse-tegija";
    }

    function generateGroupCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async function isGroupCodeUnique(code: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('groups')
            .select('id')
            .eq('group_code', code)
            .single();

        if (error && error.code === 'PGRST116') {
            // This means no data found, so the group code is unique
            return true;
        } else if (data) {
            return false;
        } else {
            throw new Error(error.message);
        }
    }

    type GroupData = {
        group_name: string;
        group_code: string;
        leader: boolean;
    };

    async function handleCreateGroup(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const data: GroupData = {
            group_name: formData.get('group_name') as string,
            group_code: '',
            leader: true
            
        };

        let groupCode: string;
        while (true) {
            groupCode = generateGroupCode();
            if (await isGroupCodeUnique(groupCode)) {
                break;
            }
        }

        data.group_code = groupCode;

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
                        group_ID: groupId,
                        leader: data.leader
                    }
                ]);

            if (userGroupError) {
                throw new Error(userGroupError.message);
            }

            console.log('Group created and user added: ', groupData);
            window.location.href = "/your-groups";
        } catch (error) {
            console.error('Error:', error);
        }
    }
</script>

{#if !loading}
    <form use:form on:submit={handleCreateGroup}>
        <h1>Create Group</h1>

        <input type="text" name="group_name" placeholder="Group Name" use:validators={[required]} />
        <Hint for="group_name" on="required">This is a mandatory field</Hint>

        <button disabled={!$form.valid}>Create Group</button>
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
