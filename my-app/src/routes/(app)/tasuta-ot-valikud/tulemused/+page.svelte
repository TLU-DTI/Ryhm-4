<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { sat_decision_name, sat_decisions, sat_objects, sat_user_id, sat_click_counts } from '../../../../store.js';

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
    
    let code: number | null = null;
    let valikud: { title: string, lk: number, per: number }[] = [];

    onMount(() => {
        const urlCode = get(page).url.searchParams.get("code");
        if (urlCode) {
            code = parseInt(urlCode, 10);
        }

        calculateResults();
    });

    function calculateResults() {
        const clickCounts: Record<string, number> = get(sat_click_counts);
        const objects: string[] = get(sat_objects);
        const totalClicks: number = Object.values(clickCounts).reduce((sum: number, count: number) => sum + count, 0);

        valikud = objects.map(obj => {
            const count: number = clickCounts[obj] || 0;
            const percentage: number = totalClicks > 0 ? (count / totalClicks) * 100 : 0;
            return { title: obj, lk: count, per: parseFloat(percentage.toFixed(2)) };
        }).sort((a, b) => b.per - a.per);
    }

    let kriteeriumid: { title: string, lk: number, per: number }[] = [
        { title: "kriteerium1", lk: 1, per: 40.0},
        { title: "kriteerium2", lk: 1, per: 10.0},
        { title: "kriteerium3", lk: 1, per: 20.0},
        { title: "kriteerium4", lk: 1, per: 30.0}
    ];
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
            <Button size="large" on:click={() => goto("/")} on:keydown>Lõpeta</Button>
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
    

    .tulem{
        background-color: white;
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
    @keyframes fillAnimation {
        from {
            width: 0;
        }
        to {
            width: var(--percentage);
        }
    }
</style>
