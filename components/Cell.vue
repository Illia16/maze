<template>
    <div :class="[`maze-cell x${cellState.cellX} y${cellState.cellY}`]">
        {{cellState.cell}}
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: [ 'cellData' ],
    data() {
        return {
            cellState: this.cellData,
        };
    },
    mounted() {
        console.log('this data', this.cellState);
        console.log('this data', this.cellState.cellX);
        console.log('this data', this.cellState.cellY);
    },
});
</script>

<style lang="scss" scoped>

</style>
