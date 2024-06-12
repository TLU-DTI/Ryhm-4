<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { writable, get } from 'svelte/store';
    import { sat_user_id } from '../../../store.js';

    console.log($sat_user_id);

    // Define the type for groupInfo
    interface GroupInfo {
        group_ID: string;
        user_ID: string;
    }

    const groupInfo = writable<GroupInfo[]>([]);

    onMount(async () => {
        const currentUserId = get(sat_user_id); // Get the current user ID from the store
        if (currentUserId !== null) {
            try {
                const { data: group_info, error } = await supabase
                    .from('users_groups')
                    .select('group_ID, user_ID')
                    .eq('user_ID', currentUserId);

                if (error) {
                    throw new Error(error.message);
                }

                groupInfo.set(group_info || []);

            } catch (error) {
                console.error('Error fetching user groups:', error);
            }
        } else {
            console.error('User ID is null, cannot fetch user groups.');
        }
    });
</script>

<h1>Your Groups</h1>

<ul>
    {#each $groupInfo as info}
        <li>Group ID: {info.group_ID}, User ID: {info.user_ID}</li>
    {/each}
</ul>
