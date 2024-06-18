<script lang="ts">
    import '$lib/styles.css';
    import { supabase } from '$lib/supabaseClient';
    import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
    import { useForm, validators, HintGroup, Hint, required } from "svelte-use-form";
    import { writable } from 'svelte/store';
    import { sat_user_id, sat_premium } from '../../../../store.js';
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";

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
            //window.location.href = "/groups/your-groups";
        } catch (error) {
            console.error('Error:', error);
        }
    }
</script>

<section class="center-container">
    {#if !loading}
    <form class="rectangle" use:form on:submit={handleCreateGroup}>
            <h1>Grupi loomine</h1>
            <p>Lisa grupile nimi</p>

            <div class="input mandatory">
                <Input type="text" name="group_name" placeholder="Grupi nimi"></Input>
                <Hint for="group_name" on="required">*</Hint>
            </div>

            <div class="create">
                <Button type="button" on:click={() => goto("/groups")} on:keydown>Tagasi</Button>
                <Button type="submit" disabled={!$form.valid}>Loo grupp</Button>
            </div>
        </form>
    {/if}
</section>
<style>
    
    .center-container {
		display: flex;
		justify-content: center;
		align-items: center;
        padding: 170px;
	}

    .rectangle {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 610px; 
		height: 410px; 
		background: white; 
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
		border-radius: 38px;
		padding: 40px 10px; 
		box-sizing: border-box; 
	}

    h1 {
      margin-bottom: 50px;
    }

    .mandatory {
		display: flex;
		align-items: center;
		color: red;
		gap: 5px;
	}

    .create {
        display: flex;
		justify-content: center;
        margin-top: 50px;
        gap: 230px;
    }
    
    .input {
		display: flex;
		flex-direction: column;
		gap: 25px; 
		width: 100%; 
		align-items: center; 
	}

    :global(.touched:invalid) {
        border-color: red;
        outline-color: red;
    }
</style>
