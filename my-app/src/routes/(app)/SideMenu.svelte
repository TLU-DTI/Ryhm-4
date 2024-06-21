<script lang="ts">
    import logo from '$lib/images/DMlogo.svg';
    import homeIcon from '$lib/images/home.svg';
    import choicesIcon from '$lib/images/choices.svg';
    import resultsIcon from '$lib/images/results.svg';
    import groupsIcon from '$lib/images/groups.svg';
    import premiumIcon from '$lib/images/premium.svg';
    import logoutIcon from '$lib/images/logout.svg';
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { get } from "svelte/store";
    import { afterUpdate } from 'svelte';

    import { sat_user_id, sat_username, sat_premium } from '../../store.js';

    //let FreeUserView:boolean = $sat_premium;

    // Define a type for the button configuration
    type ButtonConfig = {
        id: number;
        label: string;
        icon: string; 
        route: string;
    };

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
            route: '/tulemused/mitte-kattesaadav'
        },
        {
            id: 4,
            label: 'Grupid',
            icon: groupsIcon,
            route: '/groups'
        },
        {
            id: 5,
            label: 'Osta tasuline versioon',
            icon: premiumIcon,
            route: '/premium'
        },
        {
            id: 6,
            label: 'Logi välja',
            icon: logoutIcon,
            route: '/home'
        }
    ];

        const button2 = buttons.find(button => button.id === 2);
            if (button2) {
                if (!$sat_premium) {
                    button2.route = '/tasuta-ot-valikud';
                    buttons.splice(buttons.findIndex(button => button.id === 4), 1); // Remove button with id 4
                } else {
                    button2.route = '/tasuline-ot-valikud';
                    buttons.splice(buttons.findIndex(button => button.id === 5), 1); // Remove button with id 5
                }
            }

   // Track clicked state for each button
   let clickedButtons: Record<number, boolean> = {};

    function handleClick(buttonId: number, route: string): void {
        goto(route).then(() => {
            clickedButtons = { ...clickedButtons, [buttonId]: true };
        });
    }

    afterUpdate(() => {
        const currentPath = get(page).url.pathname;
        buttons.forEach(button => {
            clickedButtons = {
                ...clickedButtons,
                [button.id]: currentPath === button.route
            };
        });
    });


     // Function to check if the button's route matches the current path
     function isActive(route: string): boolean {
        const currentPath = get(page).url.pathname;
        return currentPath === route;
    }

    let isOpen = true;
    let loading = true;  // State to track loading status
    let currentUserId = null;
    let currentUsername = "";

    function toggleMenu() {
        isOpen = !isOpen;
    }

    function logout() {
        // Clear the user ID from the store and localStorage
        sat_user_id.set(null);
        sat_username.set(null);
        sat_premium.set(null);
        // Redirect to the login page
        window.location.href = '/home';
    }

    onMount(() => {
        sat_user_id.subscribe(value => {
            currentUserId = value;
            if (currentUserId == null) {
                window.location.href = "/login";
            } else {
                loading = false;  // Set loading to false if user is authenticated
            }
        });
        sat_username.subscribe(value => {
            currentUsername = value || "";
        });
    });
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

    .head {
        display: grid;
        grid-template-columns: 1fr max-content;
        grid-row: 1fr 1fr 1fr;
    }

    .kasutaja {
       padding-left: 20px;
    }
  
    .logo {
        display: flex;
        gap: 20px;
        padding: 20px;
        height: max-content;
        min-width: 200px;
        align-items: center;
        grid-row: 1 / span 2;
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
        width: 100%;
    }

    .menu-item.active{
        background: #CFFFCB;
        width: 100%
    }
    
    .close-button {
        grid-row: 1;
        grid-column: 2;
        display: flex;
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
        <div class="head">
            <div class="logo"> 
                <img src={logo} alt="logo"width="50px" height="50px"/>
                <p>Valiku Võlur</p>
            </div>
            
            <div class="close-button {isOpen ? 'open' : 'closed'}" on:click={toggleMenu} on:keydown>
                <span>&times;</span>
            </div>
        </div>
        
        <div class="kasutaja">
            <p>Tere {currentUsername}!</p>
        </div>

        <div class="menu">
            {#each buttons as button}
                {#if button.id === 6} 
                    <button 
                        class="menu-item {isActive(button.route) ? 'active' : ''} {clickedButtons[button.id] ? 'clicked' : ''}" 
                        on:click={logout}>
                        <img src={button.icon} alt="{button.label} icon" width="35px" height="35px"/>
                        <p>{button.label}</p>
                    </button>
                {:else}
                    <button 
                        class="menu-item {isActive(button.route) ? 'active' : ''} {clickedButtons[button.id] ? 'clicked' : ''}" 
                        on:click={() => handleClick(button.id, button.route)}>
                        <img src={button.icon} alt="{button.label} icon" width="35px" height="35px"/>
                        <p>{button.label}</p>
                    </button>
                {/if}
            {/each}
        </div>  
    </div>
{:else}
    <div class="open-button {isOpen ? 'open' : 'closed'}" on:click={toggleMenu} on:keydown>
        <span>&#9776;</span>
    </div >
{/if}
