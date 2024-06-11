<script lang="ts">
    export let disabled = false;  
    export let value = "";

</script>

<style>
    .input {
        display: flex;
        position: relative;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
        

        width: 400px;
        height: max-content;        

        cursor: pointer;
        border-radius: 40px;
        border: 1px solid #DDD8D8;
        background: #F8F8F8;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
        padding: 20px;

        font-family: 'Merriweather', serif;
        font-weight: 400;
	    font-size: 20px;
    }
    
    input::placeholder {
        color: rgba(0, 0, 0, 0.5);
        font-weight: 300;
    }

    input {
        width: 100%;
        background: #F8F8F8;
    }
 
    .input:hover {
        border: 2px solid #C4F1C0;    }

    .input:disabled {
        opacity: 0.5;
        pointer-events: none;
    }

</style>


<div class="input" class:disabled>
    <input {disabled} bind:value type="text" />
</div>