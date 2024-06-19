<script lang="ts">
	import '$lib/styles.css';
	import Input from "$lib/components/Input.svelte";
	import Button from "$lib/components/Button.svelte";
    import { sat_user_id, sat_premium, sat_group_id } from '../../../../../store.js';
    import { goto } from "$app/navigation";
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { writable, get } from 'svelte/store';

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

<section>
	<div class="container">
		<div class="rectangle-up"> 
			<img src="../../src/lib/images/free-verified-badge-1-866240.webp" alt="Õnnestus!" width="200" height="200">
		</div>

		<div class="rectangle-down"> 

			<div class="success">
				<p>Grupi loomine õnnestus!</p>
                <div class="copy">
                    {#each $groupInfo as info}
                    {#if $sat_group_id == info.group_ID}
                        <div class="copy2">
                            <span class="group-code-text">Loodud grupi kood:</span>
                            <Button type="button" style="secondary" on:click={() => copyToClipboard(info.group_code)} on:keydown>
                                <span><div>{info.group_code}<img src="../../src/lib/images/copy.png" alt="copy icon" class="icon"/></div></span>
                            </Button>
                        </div>
                    {/if}
                    {/each}
                </div>    
			</div>


			<div class="continue">
                <Button type="button" on:click={() => goto("/groups/your-groups")} on:keydown>Vaata oma gruppe</Button>
			</div>

		</div>
	</div>
</section>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 180px;
    }

    .rectangle-up {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 500px;
        height: 255px;
        background: #CFFFCB;
        border-top-left-radius: 38px;
        border-top-right-radius: 38px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    }

    .rectangle-down {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 500px;
        height: 220px;
        background: white;
        border-bottom-left-radius: 38px;
        border-bottom-right-radius: 38px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    }

    .success {
        margin-top: -15px;
        text-align: center;
    }

    .copy {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 30px;
        gap: 10px;
    }

    .copy2 {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    .group-code-text {
        font-size: 20px;
    }

    .icon {
        width: 16px;
        height: 16px;
        margin-left: 8px;
    }

    .continue {
        margin-top: -5px;
    }

</style>