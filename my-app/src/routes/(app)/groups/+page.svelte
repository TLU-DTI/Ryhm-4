
<script lang="ts">
    import '$lib/styles.css';
    import { goto } from "$app/navigation";
    import Input from "$lib/components/Input.svelte";
    import Button from "$lib/components/Button.svelte";
</script>

<section class="container">
    <div class="rectangle1">
        <div class="rectangle-up"> 
            <img src="..\src\lib\images\new-group.svg" alt="Loo grupp" width="100" height="100">
        </div>
        <div class="rectangle-down"> 
            <div class="continue">
                <Button on:click={() => goto("./groups/create-group")} on:keydown>Loo uus grupp</Button>
            </div>
        </div>
    </div>  
    <div class="rectangle2">
        <div class="rectangle-up"> 
            <img src="..\src\lib\images\group.svg" alt="Grupid" >
        </div>
        <div class="rectangle-down"> 
            <div class="continue">
                <Button on:click={() => goto("./groups/your-groups")} on:keydown>Vaata oma gruppe</Button>
            </div>
        </div>
    </div>  
    <div class="rectangle3">
        <div class="rectangle-up"> 
            <img src="..\src\lib\images\join-group.svg" alt="Liitu grupiga" >
        </div>
        <div class="rectangle-down"> 
            <div class="continue">
                <Button on:click={() => goto("./groups/join-group")} on:keydown>Liitu grupiga</Button>
            </div>
        </div>
    </div>
</section>


<style>
    .container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding-top: 220px;
    gap: 50px;
    }
    .rectangle1, .rectangle2, .rectangle3 {
        display: flex;
        flex-direction: column;
        align-items: center;
        
    }
    .rectangle-up {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
        height: 200px;
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
        width: 300px;
        height: 100px;
        background: white;
        border-bottom-left-radius: 38px;
        border-bottom-right-radius: 38px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    }
</style>
