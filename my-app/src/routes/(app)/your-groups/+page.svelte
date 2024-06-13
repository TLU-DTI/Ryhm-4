<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { writable, get } from 'svelte/store';
    import { sat_user_id } from '../../../store.js';

    // Define the type for groupInfo
    interface GroupInfo {
        group_ID: number;
        group_name: string;
        group_code: string;
        leader: boolean;
        members: Array<{ user_ID: number, user_name: string, is_current_user: boolean, is_leader: boolean }>;
    }

    const groupInfo = writable<GroupInfo[]>([]);
    let loading = true;  // State to track loading status

    onMount(async () => {
        await refreshGroupInfo();
    });

    async function refreshGroupInfo() {
        const currentUserId = get(sat_user_id); // Get the current user ID from the store
        if (currentUserId !== null) {
            loading = true;
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
                            leader,
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
                            is_current_user: member.user_ID === currentUserId,
                            is_leader: member.leader
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
    }

    async function deleteGroup(groupId: number) {
        try {
            // First delete all members of the group
            const { data: membersData, error: membersError } = await supabase
                .from('users_groups')
                .delete()
                .eq('group_ID', groupId);

            if (membersError) {
                throw new Error(membersError.message);
            }

            console.log(`Members deleted: ${JSON.stringify(membersData)}`);

            // Then delete the group
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .delete()
                .eq('id', groupId);

            if (groupError) {
                throw new Error(groupError.message);
            }

            console.log(`Group deleted: ${JSON.stringify(groupData)}`);

            // Refresh group info after deleting the group
            await refreshGroupInfo();
        } catch (error) {
            console.error('Error deleting group:', error);
            alert('Error deleting group: ' + error);
        }
    }

    async function removeMember(groupId: number, memberId: number) {
        try {
            console.log('Leader is trying to remove: ' + memberId + ' from group id: ' + groupId);
            const { data, error } = await supabase
                .from('users_groups')
                .delete()
                .eq('group_ID', groupId)
                .eq('user_ID', memberId);

            if (error) {
                throw new Error(error.message);
            }

            console.log(`Removal successful: ${JSON.stringify(data)}`);

            // Refresh group info after removing a member
            await refreshGroupInfo();
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Error removing member: ' + error);
        }
    }
</script>

{#if loading}
    <p>Loading...</p>
{:else}
    <h1>Your Groups</h1>

    <ul>
        {#each $groupInfo as info}
            <li>
                <p>Group Name: {info.group_name}</p>
                <p>Group Code: {info.group_code}</p>
                <p>Leader: {info.leader ? 'Yes' : 'No'}</p>
                {#if info.leader}
                    <button on:click={() => deleteGroup(info.group_ID)}>Delete group</button>
                {/if}
                <h3>Members</h3>
                <ul>
                    {#each info.members as member}
                        <li>
                            {member.user_name} 
                            {member.is_current_user ? '(you)' : ''} 
                            {member.is_leader ? '(leader)' : ''}
                            {#if info.leader && !member.is_leader}
                                <button on:click={() => removeMember(info.group_ID, member.user_ID)}>Remove</button>
                            {/if}
                        </li>
                    {/each}
                </ul>
                <hr>
            </li>
        {/each}
    </ul>
{/if}
