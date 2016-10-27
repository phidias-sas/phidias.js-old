<template>
    <div class="phi-block-image">
        <img :src="block.url" style="max-width: 100%">
    </div>
</template>

<script>
export default {
    name: "phi-block-image",
    props: ["block", "action"],

    'phi-actions': {
        default: {
            title: "ver imagen"
        },

        edit: {
            title: "modificar imagen"
        }
    }    
}
</script>