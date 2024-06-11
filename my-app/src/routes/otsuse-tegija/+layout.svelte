<script>
	import Header from './Header.svelte';
	import '$lib/styles.css';
	import SideMenu from "./SideMenu.svelte";
</script>

<div class="app">
    <SideMenu/>

	<main>
		<slot />
	</main>

</div>

<style>
	.app {
		display: flex;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	@media (min-width: 480px) {
		
	}
</style>
