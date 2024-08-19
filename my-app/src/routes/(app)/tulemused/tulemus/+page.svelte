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
    let valikud: { title: string, lk: number, per: number }[] = [];

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
        fetchResultsFromDatabase();
    });

    async function fetchResultsFromDatabase() {
        try {
            // Fetch the results data from the database
            const { data, error } = await supabase
                .from('results')
                .select('click_counts, objects')
                .eq('user_ID', $sat_user_id)
                .eq('decision_ID', $sat_decision_id)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            if (data) {
                // Parse the retrieved data
                const clickCounts = JSON.parse(data.click_counts);
                const objects = JSON.parse(data.objects);

                // Calculate the results based on the fetched data
                calculateResults(clickCounts, objects);
            }
        } catch (error) {
            console.error('Error fetching results from database:', error);
        }
    }

    function calculateResults(clickCounts: Record<string, number>, objects: string[]) {
        const totalClicks: number = Object.values(clickCounts).reduce((sum: number, count: number) => sum + count, 0);

        valikud = objects.map(obj => {
            const count: number = clickCounts[obj] || 0;
            const percentage: number = totalClicks > 0 ? (count / totalClicks) * 100 : 0;
            return { title: obj, lk: count, per: parseFloat(percentage.toFixed(2)) };
        }).sort((a, b) => b.per - a.per);
    }
</script>

<section class="container">
    <div class="icontainer">
        <div class="header">
            <h2>{$sat_decision_name}</h2>
        </div>
        <div class="box">
            <div class="tulemused">
                <h2>Tulemused:</h2>
                {#each valikud as valik }
                    <div class="tulem" style="--percentage: {valik.per}%">
                        <p>{valik.title}</p>
                        <div class="percent"><p>{valik.per}%</p></div>
                    </div>
                {/each}
            </div>
        </div>
        <br>
        <div class="buttons">
            <Button size="large" on:click={() => goto("/tulemused/tulemuste-loend")} on:keydown>Lõpeta</Button>
        </div>
    </div>
</section>

<style>
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
        height: 500px;
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

    .tulemused h2 {
        text-align: center;
        font-size: 25px;
        margin-top: 10px;
    }

    .tulemused .tulem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        border-radius: 30px;
        width: 90%;
        padding: 0 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        height: 50px;
        position: relative;
        overflow: hidden;
    }

    .tulem::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0;
        background-color: #C4F1C0;
        z-index: 0;
        animation: fillAnimation 4s ease forwards;
    }

    .tulem p {
        margin: 0;
        text-align: center;
        font-size: 20px;
        z-index: 1;
    }

    .percent {
        margin-left: 70px;
        z-index: 1;
    }

    @keyframes fillAnimation {
        from {
            width: 0;
        }
        to {
            width: var(--percentage);
        }
    }
</style>
