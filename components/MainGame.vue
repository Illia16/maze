<template>
    <div
        class="maze-main relative flex flex-col items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0"
    >
        <div class="go-to-bonus">
            <NuxtLink to="/bonus">Bonus game</NuxtLink>
        </div>
        <link
            href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css"
            rel="stylesheet"
        />
        <div class="mx-auto sm:px-6 lg:px-8">
            <div class="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6">
                <h1 class="text-2xl leading-7 font-semibold">
                    Welcome to the main menu of the maze game.
                </h1>
                <div class="text-center">
                    <button @click="startGame" class="bg-yellow-600 py-3 px-4">
                        Start the game
                    </button>
                </div>
                <div class="maze flex flex-wrap" :style="{width: cellNumbersX*50+2+'px'}">
                    <template v-for="(cell, index) in cells">
                        <Cell :cellData='cell' :key="index" />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

declare interface MainGameData {
    cells: Array<Object>,
    cellNumbers: number,
    cellNumbersX: number,
    cellNumbersY: number,
    gameStarted: boolean,
}

export default Vue.extend({
    data():MainGameData {
        return {
            cells: [],
            cellNumbers: 25,
            cellNumbersX: 10,
            cellNumbersY: 5,
            gameStarted: false
        };
    },
    mounted() {
        for (let y = 1; y <= this.cellNumbersY; y++) {
            for (let x = 1; x <= this.cellNumbersX; x++) {
                this.cells.push({
                    'cellX': x,
                    'cellY': y,
                    'visited': false,
                    'directions': [
                        y !== 1 ? 'top' : null ,
                        x < this.cellNumbersX ? 'right' : null,
                        y < this.cellNumbersY ? 'bottom' : null,
                        x > 1 ? 'left' : null,
                    ],
                });
            }
        }
    },
    methods: {
        startGame() {
            this.gameStarted = true;
        },
        toXorY(coordinate:string, number:number):number {
            if (coordinate === 'x'){
                // console.log(number);

                if (number % Math.sqrt(this.cellNumbers) === 0 ) {
                    // console.log('% by 5', number);
                    return 5
                } else {
                    return number % Math.sqrt(this.cellNumbers);
                }
            } else {
                return 1
                // if (number !== 1 && number-1 % Math.sqrt(this.cellNumbers) === 0) {
                //     console.log('dd');

                //     this.cellHelper++;
                //     return this.cellHelper;
                // } else {
                //     return this.cellHelper;
                // }
            }
        }
    }
});
</script>

<style lang="scss" scoped>
.maze-main {
    @apply overflow-x-scroll p-10;
    h1 {
        @apply text-3xl text-yellow-600;
    }


    .maze {
        @apply justify-center my-10 mx-auto border;

        .maze-cell {
            @apply border-r border-b w-[50px] h-[50px];
        }
    }

    .go-to-bonus {
        @apply fixed top-1/3 -right-20 min-h-[10rem] flex items-center transition-all;

        a {
            @apply bg-yellow-600 py-3 px-4 rotate-45 transition-all;
        }

        &:hover,
        &:focus,
        &:focus-within {
            @apply right-3;
            a {
                @apply rotate-0;
            }
        }
    }
}
</style>
