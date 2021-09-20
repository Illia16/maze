<template>
    <div :class="[
            `maze-cell border border-black x${cellData.cellX} y${cellData.cellY}
            ${cellData.visited ? 'bg-green-600' : ''}
            ${cellData.validDirections.includes('entrance') ? 'border-l-0 entrance' : ''}
            ${cellData.validDirections.includes('exit') ? 'border-b-0 exit' : ''}
            ${cellData.validDirections.includes('right') ? 'border-r-0' : ''}
            ${cellData.validDirections.includes('left') ? 'border-l-0' : ''}
            ${cellData.validDirections.includes('top') ? 'border-t-0' : ''}
            ${cellData.validDirections.includes('bottom') ? 'border-b-0' : ''}
            ${cellData.validDirections.includes('right') ? 'border-r-0' : ''}
            ${cellData.validDirections.includes('left') ? 'border-l-0' : ''}
            ${cellData.validDirections.includes('top') ? 'border-t-0' : ''}
            ${cellData.validDirections.includes('bottom') ? 'border-b-0' : ''}
            ${playerPositionPropName[0] === cellData.cellX && playerPositionPropName[1] === cellData.cellY ? 'player' : ''}`
        ]">
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: [ 'cellData', 'playerPositionPropName' ],
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

    .player {
        @apply relative;

        &:before {
            content: 'PLAYER';
            @apply absolute text-[7px] inset-0 text-yellow-500 flex justify-center items-center;
        }
    }
</style>
