<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { sat_decision_name, sat_decisions, sat_objects, sat_user_id } from '../../../../store.js';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

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
    let clickCounts: { [key: string]: number } = {};
    let currentIndex = 0;
    let currentObjects: string[] = [];

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

    function shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function handleClick(object: string) {
        clickCounts[object]++;
        currentIndex++;
        if (currentIndex < decisions.length * (objects.length / 2)) {
            refreshPage();
        } else {
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
        alert(`Kõige enam valitud objekt: ${mostClickedObject}`);
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

    // Retrieve current index from the URL
    const indexParam = $page.url.searchParams.get("index");
    currentIndex = indexParam !== null ? parseInt(indexParam) : 0;

    if (objects.length >= 2) {
        const totalPairs = Math.floor(objects.length / 2);
        const decisionIndex = Math.floor(currentIndex / totalPairs);
        const shuffledObjects = shuffleArray([...objects]);
        currentObjects = shuffledObjects.slice(0, 2);
    }
</script>

<section class="container">
    {#if currentIndex < decisions.length * objects.length}
        <div class="button-container">
            <h2>Millist valikut sa eelistad, kui kriteeriumiks on: {decisions[Math.floor(currentIndex / Math.floor(objects.length / 2))]}</h2>
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
    {:else}
        <div class="result">
            <h3>Kõige enam valitud objekt: {getMostClickedObject()}</h3>
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
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
    }

    .buttons {
        width: 100%;
        margin-top: 20px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }

    .container2 {
        width: 180px;
        height: 56px;
        background: #F2F1E7;
        border-radius: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-left: 100px;
        margin-bottom: 20px;
        font-weight: 800;
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

    .error-alert {
        text-align: center;
        color: black;
        font-size: 30px;
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

    .result {
        margin-top: 20px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }

    h3 {
        font-size: 26px;
        text-align: center;
        font-weight: 200;
    }

    h2 {
        font-size: 30px;
    }
</style>
