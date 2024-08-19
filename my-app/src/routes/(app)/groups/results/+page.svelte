<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { supabase } from '$lib/supabaseClient';
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { sat_decision_name, sat_decision_id, sat_group_id, sat_user_id } from '../../../../store.js';

    let loading = true;
    let currentUserId: number | null;

    // Define the type for group results
    interface GroupResult {
        user_ID: number;
        most_picked_object: string;
        users: {
            name: string;
        };
    }

    let groupResults: GroupResult[] = [];
    let overallMostPickedObject: string | null = null;

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
        fetchGroupResults();
    });

    async function fetchGroupResults() {
    try {
        const { data, error } = await supabase
            .from('results_groups')
            .select(`
                user_ID, 
                most_picked_object, 
                users:users (name)
            `)
            .eq('group_ID', $sat_group_id)
            .eq('decision_ID', $sat_decision_id);

        if (error) {
            throw error;
        }

        // Store the fetched data with the correct type
        groupResults = data as GroupResult[];

        // Calculate the overall most picked object
        const objectCounts: Record<string, number> = {};
        groupResults.forEach(item => {
            if (item.most_picked_object in objectCounts) {
                objectCounts[item.most_picked_object]++;
            } else {
                objectCounts[item.most_picked_object] = 1;
            }
        });

        overallMostPickedObject = Object.keys(objectCounts).reduce((a, b) => objectCounts[a] > objectCounts[b] ? a : b);

    } catch (error) {
        console.error('Error fetching group results:', error);
    } finally {
        loading = false;
    }
}

</script>


<section class="container">
    <div class="icontainer">
        <div class="header">
            <h2>{$sat_decision_name}</h2>
        </div>
        <div class="box">
            <div class="tulemused">
                {#if loading}
                    <p>Loading results...</p>
                {:else}
                    {#if groupResults.length === 0}
                        <p>Selle otsuse kohta tulemusi ei leitud.</p>
                    {:else}
                        <h2>Grupi liikmed ja nende valikud</h2>
                        {#each groupResults as result}
                            <div class="tulem">
                                <p>{result.users.name}: {result.most_picked_object}</p>
                            </div>
                        {/each}
                        <br>
                        <h2>Üldiselt enim valitud objekt</h2>
                        <div class="tulem">
                            <p>{overallMostPickedObject}</p>
                        </div>
                    {/if}
                {/if}
            </div>
        </div>
        <br>
        <div class="buttons">
            <Button size="large" on:click={() => goto("/groups/look-groups")} on:keydown>Tagasi</Button>
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
    }

    .tulem p {
        margin: 0;
        font-size: 18px;
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
