<script lang="ts">
    export let type: "text" | "password" | "email" = "text";
    export let disabled = false;
    export let value = "";
    export let placeholder: string;
</script>

<style>
    input {
        display: flex;
        position: relative;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
    
        width: 400px;
        height: max-content;

        cursor: pointer;
        border-radius: 40px;
        border: 2px solid #F8F8F8;
        background: #F8F8F8;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
        padding: 20px;
    }
    
    input::placeholder {
        color: rgba(0, 0, 0, 0.5);
        font-weight: 300;
    }

    input:focus{
        outline: none;
        border: 2px solid #C4F1C0;   
    }

    input:hover {
        border: 2px solid #C4F1C0;    
    }

    input:disabled {
        opacity: 0.5;
        pointer-events: none;
    }
</style>

{#if type === "password"}
    <input {placeholder} {disabled} bind:value type="password" />
{:else if type === "email"}
    <input {placeholder} {disabled} bind:value type="email" />
{:else}
    <input {placeholder} {disabled} bind:value type="text" />
{/if}