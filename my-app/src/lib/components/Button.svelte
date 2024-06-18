<script lang="ts">
    // primary | secondary
    export let style = "primary";
    // small, medium, large
    export let size = "medium";
    export let disabled = false;
    export let type: "button" | "submit" | "reset" | undefined = undefined;
  

</script>

<style>
    button {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-width: 100px;
        cursor: pointer;
        border: 2px solid #DDD8D8;
        border-radius: 40px;
        background: var(--bg-color);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
        font-family: 'Merriweather', serif;

    }

    .style-primary {
        --color: #000000;
        --bg-color: #CFFFCB;
    }

    .style-secondary {
        --color: #000000;
        --bg-color: #F2F1E7;
    }

    .icon {
        justify-content: space-between;
    }

    button:active {
        transform: translate(2px, 2px);
    }

    button:disabled {
        opacity: 0.5;
        pointer-events: none;
    }

    .size-small {
        font-size: 14px;
        padding: 8px 12px;
    }

    .size-medium {
        font-size: 16px;
        padding: 12px 20px;
    }

    .size-large {
        font-size: 20px;
        padding: 16px 20px;
    }

    .size-mini {
        font-size: 14px;
        padding: 8px;
        min-width: 36px;
        max-width: 40px;
        min-height: 36px;
        max-height: 40px;
    }

    button:hover {
        border: 2px solid #C4F1C0;    
    }

</style>

<button class="style-{style} size-{size}" {disabled} {type} on:click>
    <slot />
</button>
