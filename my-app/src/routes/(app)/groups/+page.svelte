<script lang="ts">
    import '$lib/styles.css';
    import { goto } from "$app/navigation";
    import Button from "$lib/components/Button.svelte";
    import newgroup from '$lib/images/new-group.svg';
    import group from '$lib/images/group.svg';
    import joingroup from '$lib/images/join-group.svg';
</script>

<section class="container">
    <div class="rectangle1">
        <div class="rectangle-up"> 
            <img src={newgroup} alt="Loo grupp" width="100" height="100">
        </div>
        <div class="rectangle-down"> 
            <div class="continue">
                <Button on:click={() => goto("./groups/create-group")} on:keydown>Loo uus grupp</Button>
            </div>
        </div>
    </div>  
    <div class="rectangle2">
        <div class="rectangle-up"> 
            <img src={group} alt="Grupid" >
        </div>
        <div class="rectangle-down"> 
            <div class="continue">
                <Button on:click={() => goto("./groups/your-groups")} on:keydown>Vaata oma gruppe</Button>
            </div>
        </div>
    </div>  
    <div class="rectangle3">
        <div class="rectangle-up"> 
            <img src={joingroup} alt="Liitu grupiga" >
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
        justify-content: center;
        align-items: center;
        flex: 0.6;
        gap: 40px;
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
        height: 220px;
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
        height: 130px;
        background: white;
        border-bottom-left-radius: 38px;
        border-bottom-right-radius: 38px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    }
</style>
