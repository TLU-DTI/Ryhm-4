<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/DMlogo.svg';
	import github from '$lib/images/github.svg';
	import { sat_user_id } from '../../store.js';
    import { onMount } from 'svelte';

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	function openSideMenu() {
		dispatch("toggleSideMenu");
	}

	let loading = true;  // State to track loading status
    let currentUserId = null;

    onMount(() => {
        sat_user_id.subscribe(value => {
            currentUserId = value;
            if (currentUserId == null) {
                window.location.href = "/login";
            } else {
                loading = false;  // Set loading to false if user is authenticated
            }
        });
    });
</script>

{#if loading}
    <p></p>  <!-- Laeb -->
{:else}
    <header>
        <div class="corner">
            <a href="#sidemenu">
                <img src={logo} alt="Logo" />
            </a>
        </div>
    </header>
{/if}

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
