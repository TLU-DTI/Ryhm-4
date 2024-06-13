
<script lang="ts">
	import logo from '$lib/images/DMlogo.svg';
    import homeIcon from '$lib/images/home.svg';
    import choicesIcon from '$lib/images/choices.svg';
    import resultsIcon from '$lib/images/results.svg';
    import groupsIcon from '$lib/images/groups.svg';
    import premiumIcon from '$lib/images/premium.svg';
    import logoutIcon from '$lib/images/logout.svg';
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { get } from "svelte/store";
    
    // Define a type for the button configuration
    type ButtonConfig = {
        id: number;
        label: string;
        icon: string; // Assuming icons are paths to images or SVGs
        route: string;
    };

    // Button configurations
    const buttons: ButtonConfig[] = [
        {
            id: 1,
            label: 'Peamenüü',
            icon: homeIcon,
            route: '/'
        },
        {
            id: 2,
            label: 'Otsuste tegija',
            icon: choicesIcon,
            route: '/tasuta-ot-valikud'
        },
        {
            id: 3,
            label: 'Tulemused',
            icon: resultsIcon,
            route: '/tulemused'
        },
        {
            id: 4,
            label: 'Grupid',
            icon: groupsIcon,
            route: '/grupid'
        },
        {
            id: 5,
            label: 'Osta tasuline',
            icon: premiumIcon,
            route: '/premium'
        },
        {
            id: 6,
            label: 'Logi välja',
            icon: logoutIcon,
            route: '/login'
        }
    ];

   // Track clicked state for each button
   let clickedButtons: Record<number, boolean> = {};

    // Function to handle button click and navigation
    function handleClick(buttonId: number, route: string): void {
        // Update clicked state for the specific button
        clickedButtons = { ...clickedButtons, [buttonId]: true };

        // Navigate to the specified route
        goto(route);
    }

     // Function to check if the button's route matches the current path
     function isActive(route: string): boolean {
        const currentPath = get(page).url.pathname;
        return currentPath === route;
    }

    let isOpen = true;

    function toggleMenu() {
        isOpen = !isOpen;
    }
</script>

<style>
    .container {
        display: fixed;
        flex-direction: column;
        background: #ffffff;
        width: 300px;
        border: 1px solid black;
        box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.24);
        border-radius: 0px 10px 10px 0px;
        padding: 20px;
    }
  
    .logo {
        display: flex;
        gap: 20px;
        padding: 20px;
        height: max-content;
        min-width: 200px;
        align-items: center;
    }

    .container.open {
        display: flex;
    }

    button {
        display: flex;
        gap: 20px;
        padding: 10px 30px;
        border-radius: 40px;
        height: max-content;
        align-items: center;
        min-width: 200px;
        border: none;
        font-family: 'Merriweather', serif;
        background: white;
    }

    button:hover {
        background: #CFFFCB;
        cursor: pointer;
    }

    .menu-item.active{
        background: #CFFFCB;
    }
    
    .close-button {
        padding: 10px;
        background: #ffffff;
        border: 1px solid rgb(0, 0, 0);
        border-radius: 10px;
        cursor: pointer;
        transition: left 0.2s;
        height: max-content;
        width: max-content;
        align-self: flex-end;
    }

    .close-button.closed{
        display: flex;
    }

    .open-button{
        padding: 10px;
        background: #ffffff;
        border: 1px solid rgb(0, 0, 0);
        border-radius: 10px;
        cursor: pointer;
        transition: left 0.2s;
        height: max-content;
        width: max-content;
        margin: 20px;
    }



    
</style>

{#if isOpen} 
    <div class="container" class:open={isOpen}> 
         
        <div class="close-button {isOpen ? 'open' : 'closed'}" on:click={toggleMenu} on:keydown>
            <span>&times;</span>
        </div>
        
        <div class="logo"> 
            <img src={logo} alt="logo"/>
            <p>Desicion Maker</p>
        </div>

        {#each buttons as button}
            <button class="menu-item {isActive(button.route) ? 'active' : ''} {clickedButtons[button.id] ? 'clicked' : ''}" on:click={() => handleClick(button.id, button.route)}>
                <img src={button.icon} alt="{button.label} icon" width="35px" height="35px"/>
                <p>{button.label}</p>
            </button>
        {/each}    
    </div>
{:else}
<div class="open-button {isOpen ? 'open' : 'closed'}" on:click={toggleMenu} on:keydown>
    <span>&#9776;</span>
</div >
{/if}
