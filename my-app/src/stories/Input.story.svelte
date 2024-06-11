<script lang="ts">
    import type { Hst as Histoire } from "@histoire/plugin-svelte";
    import Input from "$lib/components/Input.svelte";

    export let Hst: Histoire;

    let placeholder = "Type Something";
    let disabled = false;
</script>

<Hst.Story layout={{ type: "grid", width: "100%" }}>
    <svelte:fragment slot="controls">
        <Hst.Text bind:value={placeholder} title="Placeholder" />
        <Hst.Checkbox bind:value={disabled} title="Disabled" />
    </svelte:fragment>

    <Hst.Variant title="Input">
        <Input {disabled} placeholder="Type Something" />
    </Hst.Variant>
    <Hst.Variant title="Input">
        <Input {disabled} placeholder="Type Something" />
    </Hst.Variant>

</Hst.Story>
