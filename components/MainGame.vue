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


declare interface CellData {
    cellX: number,
    cellY: number,
    visited: boolean,
    directions: Array<null | string>,
    enterExit: Array<string>
}
declare interface MainGameData {
    cells: Array<CellData>,
    cellNumbers: number,
    cellNumbersX: number,
    cellNumbersY: number,
    gameStarted: boolean,
    path: Array<string>,
}

export default Vue.extend({
    data():MainGameData {
        return {
            cells: [],
            cellNumbers: 25,
            cellNumbersX: 10,
            cellNumbersY: 5,
            gameStarted: false,
            path: [],
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
                    'enterExit': ['in', 'out'],
                });
            }
        }

        console.log('cells', this.cells);
        this.makePath(this.cells[0], 'entrance');
    },
    methods: {
        makePath(cell:CellData, prevCellExit:string) {
            console.log('------------------------');
            // console.log('cells', this.cells);
            console.log('cell', cell);

            const currentCell = this.cells[this.cells.indexOf(cell)];
            const isAlreadyVisited = currentCell.visited;

            if (!isAlreadyVisited) {
                currentCell.visited = true;

                // checking if it's the bottom-right cell
                if (cell.cellX === this.cellNumbersX && cell.cellY === this.cellNumbersY) {
                    currentCell.visited = true;
                    currentCell.enterExit[0] = prevCellExit === 'right' ? 'left' : 'top';
                    currentCell.enterExit[1] = 'exit';
                    console.log('END');
                    return
                }

                // checking for a valid next direction
                // const exit = cell.directions[1] ? cell.directions[1] : cell.directions[2] as string;
                const exit = this.nextDirection(cell)
                // setting entrance
                currentCell.enterExit[0] =
                    prevCellExit === 'entrance' ? 'entrance' :
                    prevCellExit === 'left' ? 'right' :
                    prevCellExit === 'right' ? 'left' :
                    prevCellExit === 'top' ? 'bottom' :
                    'top';

                // setting exit
                currentCell.enterExit[1] = exit;
                // console.log('exit', exit);
                this.path.push(exit);

                const findNextCell = this.cells.find( (el) => {
                    if (exit === 'top') {
                        return el.cellY === cell.cellY-1 && el.cellX === cell.cellX
                    } else if (exit === 'right') {
                        return el.cellX === cell.cellX+1 && el.cellY === cell.cellY;
                    } else if (exit === 'bottom') {
                        return el.cellY === cell.cellY+1 && el.cellX === cell.cellX;
                    } else if (exit === 'left') {
                        return el.cellX === cell.cellX-1 && el.cellY === cell.cellY;
                    }
                })

                this.makePath(findNextCell as CellData, exit)
            } else {
                const lastMove = this.path[this.path.length-1];
                console.log('lastMove', lastMove);

                const findPrevCell = this.cells.find( (el) => {
                    console.log('el', el);
                    console.log('cell', cell);

                    if (lastMove === 'top') {
                        return el.cellX === cell.cellX && el.cellY === cell.cellY+1
                    } else if (lastMove === 'bottom') {
                        return el.cellX === cell.cellX && el.cellY === cell.cellY-1
                    } else if (lastMove === 'right') {
                        return el.cellY === cell.cellY && el.cellX === cell.cellX-1
                    } else if (lastMove === 'left') {
                        return el.cellY === cell.cellY && el.cellX === cell.cellX+1
                    }
                })

                console.log('prevCellExit', prevCellExit);
                this.path.pop();
                console.log(this.path[this.path.length-1]);
                console.log('findPrevCell', findPrevCell);

                // this.makePath(findPrevCell as CellData, this.path[this.path.length-1]);
            }
        },
        nextDirection(cell:CellData):string {
            const allPossibleDirections = cell.directions.filter(el=>el);
            const randomDirection = allPossibleDirections[Math.floor(Math.random()*allPossibleDirections.length)];
            return randomDirection as string;
        },
        checkIfVisited() {

        },
        startGame() {
            this.gameStarted = true;
        },
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
        @apply justify-center my-10 mx-auto;

        .maze-cell {
            @apply w-[50px] h-[50px];
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
