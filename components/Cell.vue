<template>
    <!-- <div :class="[`maze-cell x${cellState.cellX} y${cellState.cellY}`]"> -->
    <div :class="[
            `maze-cell border border-black x${cellState.cellX} y${cellState.cellY}
            ${cellState.visited ? 'bg-green-600' : ''}
            ${cellState.enterExit[0] === 'entrance' ? 'border-l-0' : ''}
            ${cellState.enterExit[1] === 'exit' ? 'border-b-0' : ''}
            ${cellState.enterExit[0] === 'right' ? 'border-r-0' : ''}
            ${cellState.enterExit[0] === 'left' ? 'border-l-0' : ''}
            ${cellState.enterExit[0] === 'top' ? 'border-t-0' : ''}
            ${cellState.enterExit[0] === 'bottom' ? 'border-b-0' : ''}
            ${cellState.enterExit[1] === 'right' ? 'border-r-0' : ''}
            ${cellState.enterExit[1] === 'left' ? 'border-l-0' : ''}
            ${cellState.enterExit[1] === 'top' ? 'border-t-0' : ''}
            ${cellState.enterExit[1] === 'bottom' ? 'border-b-0' : ''}`
        ]">
        x{{cellState.cellX}}
        y{{cellState.cellY}}
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
        // console.log('this data', this.cellState);
        // console.log('this data', this.cellState.cellX);
        // console.log('this data', this.cellState.cellY);
    },
});
</script>

<style lang="scss" scoped>

</style>
