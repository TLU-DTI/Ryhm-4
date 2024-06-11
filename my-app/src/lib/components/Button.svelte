<script lang="ts">
    // primary | secondary
    export let style = "primary";
    // small, medium, large
    export let size = "small";
    export let disabled = false;
    export let type: "button" | "submit" | "reset" | undefined = undefined;
  

</script>

<style>
    button {
        display: flex;
        width: 180px;
        height: 56px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 57px;
        cursor: pointer;
        border-radius: 40px;
        background: var(--bg-color);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
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

    button:hover {
        transform: translate(-2px, -2px);
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
        font-size: 14px;
        padding: 12px 20px;
    }

    .size-large {
        font-size: 16px;
        padding: 16px 20px;
    }

    @media screen and (min-width: 720px) {
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
    }
</style>

<button class="style-{style} size-{size}" {disabled} {type} on:click>
    <slot />
</button>
