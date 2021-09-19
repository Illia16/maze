<template>
    <div :class="[
            `maze-cell border border-black x${cellState.cellX} y${cellState.cellY}
            ${cellState.visited ? 'bg-green-600' : ''}
            ${cellState.validDirections.includes('entrance') ? 'border-l-0 entrance' : ''}
            ${cellState.validDirections.includes('exit') ? 'border-b-0 exit' : ''}
            ${cellState.validDirections.includes('right') ? 'border-r-0' : ''}
            ${cellState.validDirections.includes('left') ? 'border-l-0' : ''}
            ${cellState.validDirections.includes('top') ? 'border-t-0' : ''}
            ${cellState.validDirections.includes('bottom') ? 'border-b-0' : ''}
            ${cellState.validDirections.includes('right') ? 'border-r-0' : ''}
            ${cellState.validDirections.includes('left') ? 'border-l-0' : ''}
            ${cellState.validDirections.includes('top') ? 'border-t-0' : ''}
            ${cellState.validDirections.includes('bottom') ? 'border-b-0' : ''}`
        ]">
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
});
</script>

<style lang="scss" scoped>
    .entrance {
        @apply relative;

        &:before {
            content: 'Entrance';
            @apply absolute text-[7px] top-2;
        }
    }

    .exit {
        @apply relative;

        &:before {
            content: 'Exit';
            @apply absolute text-[7px] bottom-2 right-2;
        }
    }
</style>
