<script lang="ts">
    import { supabase } from '$lib/supabaseClient';
    import { onMount } from 'svelte';
    import { writable, get } from 'svelte/store';
    import { sat_user_id, sat_premium, sat_group_id } from '../../../../store.js';
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";

    onMount(() => {
        sat_user_id.subscribe(value => {
            if ($sat_user_id == null) {
                window.location.href = "/login";
            } else if ($sat_premium == false){
                location.href = "/";
            } else {
                loading = false;
            }
        });
    });

    // Define the type for groupInfo
    interface GroupInfo {
        group_ID: number;
        group_name: string;
        group_code: string;
        leader: boolean;
        members: Array<{ user_ID: number, user_name: string, is_current_user: boolean, is_leader: boolean }>;
        decisions: Array<{ id: number, choice_name: string }>;
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

                    const { data: decisions, error: decisionsError } = await supabase
                        .from('premium_decisions_groups')
                        .select(`
                            premium_decisions (id, choice_name)
                        `)
                        .eq('group_ID', info.group_ID);

                    if (decisionsError) {
                        throw new Error(decisionsError.message);
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
                        })),
                        decisions: (decisions || []).map((decision: any) => ({
                            id: decision.premium_decisions.id,
                            choice_name: decision.premium_decisions.choice_name
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

    async function leaveGroup(groupId: number, memberId: number) {
        try {
            console.log(memberId, groupId);
            // First delete all members of the group
            const { data: membersData, error: membersError } = await supabase
                .from('users_groups')
                .delete()
                .eq('group_ID', groupId)
                .eq('user_ID', memberId);

            if (membersError) {
                throw new Error(membersError.message);
            }

            console.log(`Members deleted: ${JSON.stringify(membersData)}`);

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
    async function groupdesicion(groupId: number) {
        try {
            sat_group_id.set(groupId);
            location.href = "/groups/desicion-name";

        } catch (error) {
            console.error('Error making a group desicion:', error);
            alert('Error making a group desicion: ' + error);
        }
    }
    async function removeDesicion(groupId: number, decisionId: number) {
    try {
        const { data: deleteGroupDecisionData, error: deleteGroupDecisionError } = await supabase
            .from('premium_decisions_groups')
            .delete()
            .eq('group_ID', groupId)
            .eq('premium_decisions_ID', decisionId);

        if (deleteGroupDecisionError) {
            throw new Error(deleteGroupDecisionError.message);
        }

        const { data: deleteDecisionData, error: deleteDecisionError } = await supabase
            .from('premium_decisions')
            .delete()
            .eq('id', decisionId);

        if (deleteDecisionError) {
            throw new Error(deleteDecisionError.message);
        }

        console.log(`Removal successful: ${JSON.stringify(deleteDecisionData)}`);

        // Refresh group info after removing a decision
        await refreshGroupInfo();
    } catch (error) {
        console.error('Error removing decision:', error);
        alert('Error removing decision: ' + error);
    }
    }

    function copyToClipboard(group_code: string) {
        if (group_code) {
            navigator.clipboard.writeText(group_code)
                .then(() => {
                    console.log('Text copied to clipboard');
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        } else {
            console.error('Group code is not defined');
        }
    }
</script>

<section class="center-container">
    {#if loading}
        <p>Loading...</p>
    {:else}
        <div class="rectangle">
            {#each $groupInfo as info}
            {#if $sat_group_id == info.group_ID}
                <div class="copy">
                    <h1>{info.group_name}</h1>
                    <Button type="button" style="secondary" on:click={() => copyToClipboard(info.group_code)} on:keydown>
                        <span><div>{info.group_code}<img src="../src/lib/images/copy.svg" alt="copy icon" class="icon"/></div></span>
                    </Button>
                </div>
                <div class="boxes-container">
                    <div class="box">
                        <div class="box-title">Liikmed</div>
                        <div class="box-content">
                            {#each info.members as member}
                                <div class="member-row">
                                    <span>
                                       { #if member.is_leader}
                                            <img src="../src/lib/images/crown.svg" alt="Leader" class="leader-icon">
                                        {/if}
                                        {member.user_name} 
                                    </span>
                                    {#if info.leader && !member.is_leader}
                                        <button on:click={() => removeMember(info.group_ID, member.user_ID)} class="icon-button">
                                            <img src="../src/lib/images/trash.svg" alt="Delete user">
                                        </button>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div class="box">
                        <div class="box-title">Otsused</div>
                        <div class="box-content">
                            {#each info.decisions as decision}
                            <div class="member-row">
                                    <span><button class="name">{decision.choice_name}</button></span> <!--TEKST VAJA TEHA KLIKITAVAKS-->
                                    <div class="icons-container">
                                        <!-- <button on:click={() => groupdesicion(info.group_ID)} class="icon-button">
                                            <img src="../src/lib/images/new-group.png" alt="Decisions">
                                        </button> -->
                                        <button on:click={() => groupdesicion(info.group_ID)} class="icon-button">
                                            <img src="../src/lib/images/results.svg" alt="Results">
                                        </button>
                                        {#if info.leader}
                                        <button on:click={() => removeDesicion(info.group_ID, decision.id)} class="icon-button">
                                            <img src="../src/lib/images/trash.svg" alt="Delete decision">
                                        </button>
                                        {/if}   
                                    </div>
                            </div>        
                            {/each}
                        </div>
                    </div>
                </div>
                <div class="btn">
                    <div class="buttons-left">
                        <Button type="button" style="secondary" on:click={() => goto("/groups/your-groups")} on:keydown>Tagasi</Button>
                        {#if info.leader}
                            <Button style="secondary" on:click={() => deleteGroup(info.group_ID)}>Kustuta grupp</Button>
                        {/if}
                    </div>
                    <div class="buttons-right">
                        {#if info.leader}
                        <Button on:click={() => groupdesicion(info.group_ID)}>Loo uus otsus</Button>
                        {/if}
                    </div>
                </div>  
            {/if}  
            {/each}
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
        width: 1000px;
        height: auto;
        background: white;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
        border-radius: 38px;
        padding: 40px 10px;
        box-sizing: border-box;
    }
    
    .copy {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: -20px;
        margin-bottom: 30px;
        gap: 30px;
    }

    .icon {
        width: 16px;
        height: 16px;
        margin-left: 8px;
    }

    .boxes-container {
        display: flex;
        justify-content: space-around;
        width: 800px;
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 20px;
        gap: 30px;
    }

    .box {
        width: 45%;
        background: #F2F1E7;
        border-radius: 15px;
        padding: 20px;
        position: relative;
    }

    .box-title {
        position: absolute;
        top: -30px;
        left: 140px;
        background: white;
        padding: 0 10px;
        font-size: 20px;
    }

    .box-content {
        max-height: 150px; 
        overflow-y: auto; 
        scrollbar-width: thin; 
        scrollbar-color: #C4F1C0 #ffffff9e; 
        padding-right: 10px;
    }

    .box-content::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    .box-content::-webkit-scrollbar-thumb {
        background-color: #aaa;
        border-radius: 10px;
    }

    .box-content::-webkit-scrollbar-track {
        background-color: #f0f0f0;
        border-radius: 10px;
    }

    .member-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        border-bottom: 1px solid #aaa;
    }

    .member-row span {
        flex: 1;
    }

    .icons-container {
        display: flex;
        justify-content: flex-end;
        gap: 5px; 
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

    .leader-icon {
        width: 20px;
        height: 20px;
        margin-right: 5px; 
        margin-left: 0; 
    }

    .btn {
        display: flex;
        margin-top: 23px;
        margin-left: 25px;
        align-self: start;
        justify-content: space-between; 
        gap: 420px;
    }

    .buttons-left {
        flex: 1; 
        display: flex;
        justify-content: flex-start;
        gap: 15px;
    }

    .buttons-right {
        display: flex;
        justify-content: flex-end;
    }

    .name {
        border: none;
        background-color: #F2F1E7;
        font-family: 'Merriweather', serif;
        font-size: 16px;
    }
</style>
