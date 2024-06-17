<script lang="ts">
    import '$lib/styles.css';
    import { supabase } from '$lib/supabaseClient';
    import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
    import { useForm, validators, HintGroup, Hint, required } from "svelte-use-form";
    import { writable } from 'svelte/store';
    import { sat_user_id } from '../../../../store.js';
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";

    const form = useForm();
    let loading = true;
    let currentUserId: number | null;

    function checkAuth() {
        sat_user_id.subscribe(value => {
            currentUserId = value;
            if (currentUserId == null) {
                window.location.href = "/login";
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
                throw new Error('Gruppi ei leitud!');
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
                console.error('Sa oled juba selle grupi liige!');
                throw new Error('Sa oled juba selle grupi liige!');
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
            window.location.href = "/groups/join-group/join-group-completed";
        } catch (error) {
            console.error('Error:', error);
            alert(error); // Display error message to the user
        }
    }
</script>

<section class="center-container">
    {#if loading}
        <p></p>
    {:else}
        <form class="rectangle" use:form on:submit={handleJoinGroup}>
            <h1>Liitu grupiga</h1>
            <p>Sisesta grupi kood:</p>

            <div class="input mandatory">
                <Input type="text" name="group_code" placeholder="Grupi kood"></Input>
                <Hint for="group_code" on="required">*</Hint>
            </div>

            <div class="join">
                <Button type="button" style="secondary" on:click={() => goto("/groups")} on:keydown>Tagasi</Button>
                <Button disabled={!$form.valid}>Liitu grupiga</Button>
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
		height: 450px; 
		background: white; 
		box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
		border-radius: 38px;
		padding: 40px 10px; 
		box-sizing: border-box; 
	}

    h1 {
      margin-bottom: 60px;
    }

    .mandatory {
		color: red;
		gap: 5px;
	}

    .join {
        display: flex;
		justify-content: center;
        margin-top: 80px;
        gap: 230px;
    }
    
    .input {
		display: flex;
		flex-direction: row;
		align-items: center; 
	}
</style>
