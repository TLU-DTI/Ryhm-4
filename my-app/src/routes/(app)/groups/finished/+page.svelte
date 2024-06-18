<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";
    import { premiumDecisionStore } from '../../../../store-group/premiumDecisionStore';
    import { supabase } from '$lib/supabaseClient';
    import { get } from "svelte/store";
    import { sat_user_id, sat_group_id } from '../../../../store.js';

    let premiumDecisionData = get(premiumDecisionStore);
    let userId: number | null = null;
    let groupId: number | null = null;

    sat_user_id.subscribe(value => {
        userId = value;
    });

    sat_group_id.subscribe(value => {
        groupId = value;
    });

    console.log('Retrieved userId:', userId);

    async function saveToDatabase() {
        const dataToInsert = {
            choice_name: premiumDecisionData.decisionName,
            model_type: premiumDecisionData.modelType,
            choices: premiumDecisionData.choices,
            criteria: premiumDecisionData.criteria,
            user_id: userId,
        };

        // Log the data being sent to the database
        console.log('Data being sent to the database:', dataToInsert);

        try {
            const { data, error } = await supabase
                .from('premium_decisions')
                .insert([dataToInsert])
                .select('id')
                .single();

            if (error) {
                throw new Error(error.message);
            } else {
                console.log('Data saved successfully');
                // Reset the project store
                premiumDecisionStore.resetStore();
            }

            const decision_id = data.id;

            const { error: userGroupError } = await supabase
                .from('premium_decisions_groups')
                .insert([
                    {
                        group_ID: groupId,
                        premium_decisions_ID: decision_id
                    }
                ]);

            if (userGroupError) {
                throw new Error(userGroupError.message);
            }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }

    function startAnswering() {
        saveToDatabase().then(() => goto("/groups/your-groups"));
    }

    function saveResult() {
        saveToDatabase().then(() => goto("/groups/your-groups"));
    }

    function goBack() {
        goto("/groups/choices");
    }
</script>

<section class="container">
    <div class="input-container">
        <h2>Mida soovid edasi teha?</h2>
        <div class="buttons">
            <Button on:click={saveResult} on:keydown>Salvesta tulemus</Button>
            <Button style="secondary" on:click={goBack} on:keydown>Tagasi</Button>
            <Button on:click={startAnswering} on:keydown>Alusta vastamist</Button>
        </div>
    </div>
</section>

<style>
    section.container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0.7;
    }

    .input-container {
        background-color: white;
        border-radius: 20px;
        height: auto;
        padding: 40px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* varjuefekt */
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .buttons {
        margin-top: 40px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }

    h2 {
        font-size: 30px;
    }
</style>
