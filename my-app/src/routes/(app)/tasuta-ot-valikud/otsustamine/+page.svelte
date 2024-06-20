<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { page } from "$app/stores";
    import { sat_decision_name, sat_decisions, sat_objects, sat_user_id, sat_click_counts } from '../../../../store.js';
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
            showResults();
            window.location.href = "/tasuta-ot-valikud/tulemused";
        }
    }

    function refreshPage() {
        const url = new URL(window.location.href);
        url.searchParams.set("index", currentIndex.toString());
        window.location.href = url.toString();
    }

    function showResults() {
        const mostClickedObject = getMostClickedObject();
        alert(`Most chosen object: ${mostClickedObject}`);
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
            <h2>Which option do you prefer for: {decisions[decisionIndex]}</h2>
           
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
