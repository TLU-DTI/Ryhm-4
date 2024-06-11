<script lang="ts">
    import type { Hst as Histoire } from "@histoire/plugin-svelte";
    import Button from "$lib/components/Button.svelte";

    export let Hst: Histoire;

    let disabled = false;
    let style = "primary";
    let size = "small";
    let content = "Button";
</script>

<Hst.Story layout={{ type: "grid", width: "100%" }}>
    <svelte:fragment slot="controls">
        <Hst.ButtonGroup
            bind:value={style}
            title="Style"
            options={[
                {
                    label: "Primary",
                    value: "primary",
                },
                {
                    label: "Secondary",
                    value: "secondary",
                },
            ]}
        />
        <Hst.ButtonGroup
            bind:value={size}
            title="Size"
            options={[
                {
                    label: "Small",
                    value: "small",
                },
                {
                    label: "Medium",
                    value: "medium",
                },
                {
                    label: "Large",
                    value: "large",
                },
            ]}
        />
        <Hst.Text bind:value={content} title="Content" />
        <Hst.Checkbox bind:value={disabled} title="Disabled" />
    </svelte:fragment>

    <Hst.Variant title="Button primary">
        <Button {disabled} {style} {size}>{content}</Button>
    </Hst.Variant>
    <Hst.Variant title="Button secondary">
        <Button {disabled} {style} {size}>{content}</Button>
    </Hst.Variant>
</Hst.Story>
