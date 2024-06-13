<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { writable, get } from 'svelte/store';
    import { sat_user_id } from '../../../store.js';

    // Define the type for groupInfo
    interface GroupInfo {
        group_ID: string;
        group_name: string;
        group_code: string;
        leader: boolean;
        members: Array<{ user_ID: string, user_name: string, is_current_user: boolean }>;
    }

    const groupInfo = writable<GroupInfo[]>([]);
    let loading = true;  // State to track loading status

    onMount(async () => {
        const currentUserId = get(sat_user_id); // Get the current user ID from the store
        if (currentUserId !== null) {
            try {
                const { data: group_info, error } = await supabase
                    .from('users_groups')
                    .select(`
                        group_ID, 
                        leader, 
                        groups (group_name, group_code), 
                        users (id, name)
                    `)
                    .eq('user_ID', currentUserId);

                if (error) {
                    throw new Error(error.message);
                }

                const transformedData = await Promise.all((group_info || []).map(async (info: any) => {
                    const { data: members, error: membersError } = await supabase
                        .from('users_groups')
                        .select(`
                            user_ID,
                            users (name)
                        `)
                        .eq('group_ID', info.group_ID);

                    if (membersError) {
                        throw new Error(membersError.message);
                    }

                    return {
                        group_ID: info.group_ID,
                        group_name: info.groups.group_name,
                        group_code: info.groups.group_code,
                        leader: info.leader,
                        members: (members || []).map((member: any) => ({
                            user_ID: member.user_ID,
                            user_name: member.users.name,
                            is_current_user: member.user_ID === currentUserId
                        }))
                    };
                }));

                groupInfo.set(transformedData);
            } catch (error) {
                console.error('Error fetching user groups:', error);
            } finally {
                loading = false; 
            }
        } else {
            window.location.href = "/login"; // Redirect if user ID is null
        }
    });
</script>

{#if loading}
    <p></p>
{:else}
    <h1>Your Groups</h1>

    <ul>
        {#each $groupInfo as info}
            <li>
                <p>Group Name: {info.group_name}</p>
                <p>Group Code: {info.group_code}</p>
                <p>Leader: {info.leader ? 'Yes' : 'No'}</p>
                <h3>Members</h3>
                <ul>
                    {#each info.members as member}
                        <li>{member.user_name} {member.is_current_user ? '(you)' : ''}</li>
                    {/each}
                </ul>
                <hr>
            </li>
        {/each}
    </ul>
{/if}
