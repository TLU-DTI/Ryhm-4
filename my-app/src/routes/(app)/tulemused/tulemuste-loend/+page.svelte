<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { supabase } from '$lib/supabaseClient';
    import { goto } from "$app/navigation";
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { sat_decision_name, sat_decision_id, sat_user_id } from '../../../../store.js';

    let loading = true;
    let currentUserId: number | null;

    // Define the type for user decisions
    interface UserDecision {
        id: number;
        choice_name: string;
    }

    let userDecisions: UserDecision[] = [];

    function checkAuth() {
        sat_user_id.subscribe(value => {
            currentUserId = value;
            if ($sat_user_id == null) {
                window.location.href = "/login";
            } else {
                loading = false;
            }
        });
    }

    onMount(() => {
        checkAuth();
        fetchUserDecisions();
    });

    async function fetchUserDecisions() {
        try {
            loading = true;

            // Fetch all decision IDs that are linked to any group in premium_decisions_groups
            const { data: groupDecisions, error: groupDecisionsError } = await supabase
                .from('premium_decisions_groups')
                .select('premium_decisions_ID');

            if (groupDecisionsError) {
                throw new Error(`Error fetching group decisions: ${groupDecisionsError.message}`);
            }

            // Extract the IDs of decisions linked to groups
            const groupDecisionIds = groupDecisions.map(d => d.premium_decisions_ID);

            // Fetch the user's decisions, excluding those linked to any group
            const { data, error } = await supabase
                .from('premium_decisions')
                .select('id, choice_name')
                .eq('user_id', $sat_user_id);

            if (error) {
                throw new Error(`Error fetching user decisions: ${error.message}`);
            }

            // Apply the exclusion only if there are group decisions to exclude
            const filteredData = groupDecisionIds.length > 0
                ? data.filter(decision => !groupDecisionIds.includes(decision.id))
                : data;

            userDecisions = filteredData as UserDecision[];
        } catch (error) {
            console.error('Error fetching user decisions:', error || error);
        } finally {
            loading = false;
        }
    }

    async function deleteDecision(decisionId: number) {
    try {
        // First, delete related entries in the `premium_decision_results` table
        const { error: deleteResultsError } = await supabase
            .from('premium_decision_results')
            .delete()
            .eq('premium_decision_id', decisionId);

        if (deleteResultsError) {
            throw new Error(`Error deleting decision results: ${deleteResultsError.message}`);
        }

        // Then, delete related entries in the `results` table
        const { error: deleteResultsTableError } = await supabase
            .from('results')
            .delete()
            .eq('decision_ID', decisionId);

        if (deleteResultsTableError) {
            throw new Error(`Error deleting from results table: ${deleteResultsTableError.message}`);
        }

        // After deleting related results, delete the decision from the `premium_decisions` table
        const { error: deleteDecisionError } = await supabase
            .from('premium_decisions')
            .delete()
            .eq('id', decisionId);

        if (deleteDecisionError) {
            throw new Error(`Error deleting decision: ${deleteDecisionError.message}`);
        }

        // Refresh the list of decisions after deletion
        await fetchUserDecisions();
    } catch (error) {
        console.error('Error deleting decision:', error || error);
    }
}




async function openResults(decisionId: number) {
    try {
        // Fetch the decision name from the database based on decisionId
        const { data, error } = await supabase
            .from('premium_decisions')
            .select('choice_name')
            .eq('id', decisionId)
            .single();

        if (error) {
            throw error;
        }

        // Set the decision name and id in the store
        if (data && data.choice_name) {
            sat_decision_name.set(data.choice_name);
            sat_decision_id.set(decisionId);

            // Navigate to the results page
            goto(`/tulemused/tulemus`);
        }
    } catch (error) {
        console.error('Error fetching decision name:', error);
    }
}
</script>

<section class="container">
    <div class="icontainer">
        <div class="header">
            <h2>Teie otsused</h2>
        </div>
        <div class="box">
            <div class="tulemused">
                {#if loading}
                    <p>Teie otsuste laadimine...</p>
                {:else}
                    {#if userDecisions.length === 0}
                        <p>Ühtegi otsust ei leitud.</p>
                    {:else}
                        {#each userDecisions as decision}
                            <div class="tulem">
                                <p>{decision.choice_name}</p>
                                <Button on:click={() => openResults(decision.id)}>Tulemused</Button>
                                <Button style="danger" on:click={() => deleteDecision(decision.id)}>Kustuta</Button>
                            </div>
                        {/each}
                    {/if}
                {/if}
            </div>
        </div>
        <br>
        <div class="buttons">
            <Button size="large" on:click={() => goto("/")} on:keydown>Tagasi</Button>
        </div>
    </div>
</section>

<style>
    /* Add your existing styles here */
    .tulem {
        background-color: white;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        margin-bottom: 10px;
        width: 80%;
        text-align: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .tulem p {
        margin: 0;
        font-size: 18px;
        flex: 1;
        text-align: left;
    }

    .buttons {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    section.container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0.7;
    }

    .icontainer {
        background-color: white;
        border-radius: 20px;
        width: 1000px;
        height: auto;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
        padding-bottom: 110px;
    }

    .icontainer h2 {
        text-align: center;
        margin-right: 10px;
        font-size: 35px;
    }

    .header {
        padding: 15px;
    }

    .box {
        display: grid;
        grid-template-columns: 1fr;
        flex-direction: row;
        gap: 1px;
        align-items: center;
        place-items: center;
    }
</style>
