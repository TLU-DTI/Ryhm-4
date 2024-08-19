<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { page } from "$app/stores";
    import { supabase } from '$lib/supabaseClient';
    import { sat_decision_name, sat_decision_id, sat_decisions, sat_objects, sat_user_id, sat_click_counts } from '../../../../store.js';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    let loading = true;
    let currentUserId: number | null;

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
    });

    let decisions: string[] = [];
    let objects: string[] = [];
    let clickCounts: { [key: string]: number } = get(sat_click_counts);
    let currentIndex = 0;

    sat_objects.subscribe(value => {
        objects = Array.isArray(value) ? value : [];
        objects.forEach(obj => {
            if (!(obj in clickCounts)) {
                clickCounts[obj] = 0;
            }
        });
    });

    sat_decisions.subscribe(value => {
        decisions = Array.isArray(value) ? value : [];
    });

    function handleClick(object: string) {
        clickCounts[object]++;
        sat_click_counts.set(clickCounts); // Update the store
        currentIndex++;
        if (currentIndex < decisions.length * combinations(objects.length, 2)) {
            refreshPage();
        } else {
            saveResultsToDatabase();
            showResults();
        }
    }

    function refreshPage() {
        const url = new URL(window.location.href);
        url.searchParams.set("index", currentIndex.toString());
        window.location.href = url.toString();
    }

    function showResults() {
        const mostClickedObject = getMostClickedObject();
    }

    function getMostClickedObject() {
        let maxClicks = -1;
        let mostClickedObject = '';
        for (const [object, count] of Object.entries(clickCounts)) {
            if (count > maxClicks) {
                maxClicks = count;
                mostClickedObject = object;
            }
        }
        return mostClickedObject;
    }

    function combinations(n: number, r: number): number {
        return factorial(n) / (factorial(r) * factorial(n - r));
    }

    function factorial(num: number): number {
        if (num <= 1) return 1;
        return num * factorial(num - 1);
    }

    async function saveResultsToDatabase() {
    try {
        const clickCountsStr = JSON.stringify(clickCounts); // Convert clickCounts to JSON string

        // Convert objects and decisions arrays to PostgreSQL array format
        const objectsArray = objects;
        const decisionsArray = decisions;

        // First, save the decision to 'premium_decisions' table and retrieve the decision ID
        const { data: decisionData, error: decisionError } = await supabase
            .from('premium_decisions')
            .insert([
                {
                    user_id: $sat_user_id,
                    choice_name: $sat_decision_name,
                    model_type: 1, // Model type 1 for FC
                    choices: objectsArray, // Pass the array directly
                    criteria: decisionsArray // Pass the array directly
                }
            ])
            .select('id')
            .single(); // Retrieve the ID of the inserted row

        if (decisionError) {
            throw decisionError;
        }

        const decisionId = decisionData.id; // Get the decision ID from the inserted data

        // Then, save results to 'results' table using the decision ID from 'premium_decisions'
        const { data: existingEntry, error: selectError } = await supabase
            .from('results')
            .select('*')
            .eq('user_ID', $sat_user_id)
            .eq('decision_ID', decisionId) // Use the new decision ID
            .single();

        if (selectError && selectError.code !== 'PGRST116') { // PGRST116 means no row found
            throw selectError;
        }

        if (existingEntry) {
            // Update existing entry
            const { data: updatedData, error: updateError } = await supabase
                .from('results')
                .update({ click_counts: clickCountsStr, objects: JSON.stringify(objects) })
                .eq('user_ID', $sat_user_id)
                .eq('decision_ID', decisionId); // Use the new decision ID

            if (updateError) {
                throw updateError;
            }

            console.log('Results successfully updated in database:', updatedData);
        } else {
            // Insert new entry
            const { data: insertedData, error: insertError } = await supabase
                .from('results')
                .insert([
                    {
                        user_ID: $sat_user_id,
                        decision_ID: decisionId, // Use the new decision ID
                        click_counts: clickCountsStr,
                        objects: JSON.stringify(objects)
                    }
                ]);

            if (insertError) {
                throw insertError;
            }

            console.log('Results successfully inserted into database:', insertedData);
            window.location.href = "/tasuta-ot-valikud/tulemused";
        }

    } catch (error) {
        console.error('Error saving results to database:', error);
    }
}




    // Retrieve current index from the URL
    const indexParam = $page.url.searchParams.get("index");
    currentIndex = indexParam !== null ? parseInt(indexParam) : 0;

    let totalPairs = combinations(objects.length, 2);
    let decisionIndex = Math.floor(currentIndex / totalPairs);
    let pairIndex = currentIndex % totalPairs;
    let currentObjects: string[] = [];

    if (objects.length >= 2) {
        let pairs: string[][] = [];
        for (let i = 0; i < objects.length - 1; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                pairs.push([objects[i], objects[j]]);
            }
        }
        currentObjects = pairs[pairIndex];
    }
</script>


<section class="container">
    {#if currentIndex < decisions.length * combinations(objects.length, 2)}
        <div class="button-container">
            <h2>Millist valikut sa eelistad, kui kriteeriumiks on: {decisions[decisionIndex]}</h2>     
            <div class="all-container">
                <div class="obj-button">
                    {#if currentObjects.length > 0}
                        <Button on:click={() => handleClick(currentObjects[0])}>{currentObjects[0]}</Button>
                        {#if currentObjects.length > 1}
                            <Button on:click={() => handleClick(currentObjects[1])}>{currentObjects[1]}</Button>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</section>

<style>
    section.container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0.7;
    }

    .button-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* shadow effect */
    }

    .obj-button {
        width: 100%;
        margin-top: 40px;
        margin-bottom: 60px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 20px;
    }

    .all-container {
        width: 400px;
        height: auto;
        padding: 20px;
        padding-bottom: 10px;
        margin-bottom: 30px;
        background: white;
        border-radius: 40px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    }
    h2 {
        font-size: 30px;
    }
</style>
