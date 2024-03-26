<template>
    <div :class="[
            `maze-cell border border-black x${cellData.cellX} y${cellData.cellY}
            ${cellData.validDirections.includes('entrance') ? 'border-l-0 entrance' : ''}
            ${cellData.validDirections.includes('exit') ? 'border-b-0 exit' : ''}
            ${cellData.validDirections.includes('right') ? 'border-r-0' : ''}
            ${cellData.validDirections.includes('left') ? 'border-l-0' : ''}
            ${cellData.validDirections.includes('top') ? 'border-t-0' : ''}
            ${cellData.validDirections.includes('bottom') ? 'border-b-0' : ''}
            ${playerPositionPropName[0] === cellData.cellX && playerPositionPropName[1] === cellData.cellY ? 'player' : ''}
            ${cellData.cellX === 1 && !cellData.validDirections.includes('entrance') ? 'border-l-2' : ''}
            ${cellData.cellX === maxX ? 'border-r-2' : ''}
            ${cellData.cellY === 1 ? 'border-t-2' : ''}
            ${cellData.cellY === maxY && !cellData.validDirections.includes('exit') ? 'border-b-2' : ''}`
        ]">
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: [ 'cellData', 'playerPositionPropName', 'maxX', 'maxY' ],
    mounted() {
        console.log('X', this.maxX);
        console.log('Y', this.maxY);
    }
});
</script>

<style lang="scss" scoped>
    .maze-cell {
        @apply bg-green-600;

        &.entrance {
            @apply relative;

            &:before {
                content: 'Start';
                @apply absolute text-[7px] top-2;
            }
        }

        &.exit {
            @apply relative;

            &:before {
                content: 'Finish';
                @apply absolute text-[7px] inset-0;
            }
        }

        &.player {
            @apply relative;

            &:after {
                content: "YOU";
                @apply absolute text-[10px] inset-0 text-yellow-500 flex justify-center items-center;
            }
        }
    }
</style>
