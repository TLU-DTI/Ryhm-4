<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { writable, get } from 'svelte/store';
    import { sat_user_id } from '../../../../store.js';
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";

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

<section class="center-container">
    {#if loading}
        <p>Loading...</p>
    {:else}
        <div class="rectangle">
            <h1>Sinu grupid</h1>
            <div class="rectangle2">
                <div class="groups-list">
                    {#each $groupInfo as info}
                        <div class="group-item">
                            <div class="group-details">
                                {#if info.leader}
                                    <!--<p>Leader: {info.leader ? 'Yes' : 'No'}</p>-->
                                    <img src="../src/lib/images/crown.png" alt="Leader" class="leader-icon">
                                {/if}
                                <p>{info.group_name}</p>
                            </div>
                            <div class="button-group">
                                {#if info.leader}
                                    <button on:click={() => deleteGroup(info.group_ID)} class="icon-button">
                                        <img src="../src/lib/images/trash.png" alt="Delete group">
                                    </button>
                                {/if}
                                <Button type="button" on:click={() => goto("/groups/your-groups")} on:keydown>Vaata gruppi</Button>
                            </div>
                        </div>
                    {/each}
                </div>
                <div class="back">
                    <Button type="button" style="secondary" on:click={() => goto("/groups")} on:keydown>Tagasi</Button>
                </div>
            </div>
        </div>
    {/if}
</section>

<style>
    .center-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 130px;
    }
    .rectangle {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 610px;
        height: 510px;
        background: white;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
        border-radius: 38px;
        padding: 40px 10px;
        box-sizing: border-box;
    }
    .rectangle2 {
        width: 93%;
        padding: 20px;
    }
    .groups-list {
        max-height: 270px;
        overflow-y: auto;
        scrollbar-width: thin; /* horisontaalse kerimisriba jaoks */
        scrollbar-color: #C4F1C0 #F2F1E7; /* värvid kerimisribale (thumb, track) */
        padding-right: 10px;
    }

    .groups-list::-webkit-scrollbar {
        width: 8px; /* laius */
        height: 8px; /* kõrgus */
    }

    .groups-list::-webkit-scrollbar-thumb {
        background-color: #aaa; /* kerimisriba värv */
        border-radius: 10px; /* nurga raadius */
    }

    .groups-list::-webkit-scrollbar-track {
        background-color: #F2F1E7; /* tausta värv */
        border-radius: 10px; /* nurga raadius */
    }

    .group-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #F2F1E7;
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 10px;
    }
    .group-details {
        display: flex;
        align-items: center;
        margin-left: 10px;
    }
    .leader-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
    .button-group {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-right: 10px;
    }
    .back {
        margin: 20px 0px 10px;
    }
    .icon-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
    }
    .icon-button img {
        width: 20px;
        height: 20px;
    }
    .icon-button:hover img {
        opacity: 0.7;
    }
</style>
