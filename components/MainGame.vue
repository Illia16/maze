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
    validDirections: Array<string>
}
declare interface MainGameData {
    cells: Array<CellData>,
    cellNumbers: number,
    cellNumbersX: number,
    cellNumbersY: number,
    gameStarted: boolean,
    path: Array<string>,
}

// type RandomValidDirectionType = Array<[Array<[string, CellData]>, Array<[string, CellData]>]>;
type RandomValidDirectionType = Array<[string, CellData]>;

export default Vue.extend({
    data():MainGameData {
        return {
            cells: [],
            cellNumbers: 25,
            cellNumbersX: 5,
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
                    'validDirections': [],
                });
            }
        }

        this.makePath(this.cells[0], 'entrance');
    },
    methods: {
        makePath(cell:CellData, prevCellExit:string) {
            const currentCell = this.cells[this.cells.indexOf(cell)];

            if (cell.cellX === this.cellNumbersX && cell.cellY === this.cellNumbersY) currentCell.validDirections.push('exit')

            if (this.isAllCellsVisited()) {
                console.log('END');
                return
            }

            currentCell.visited = true;
            // checking for a valid next direction
            const validNextCell = this.getUnvisitedCell(cell);
            // setting entrance
            if (validNextCell) {
                prevCellExit === 'entrance' ? currentCell.validDirections.push('entrance') :
                prevCellExit === 'left' ? currentCell.validDirections.push('right') :
                prevCellExit === 'right' ? currentCell.validDirections.push('left') :
                prevCellExit === 'top' ? currentCell.validDirections.push('bottom') :
                currentCell.validDirections.push('top');
                // setting exit
                currentCell.validDirections.push(validNextCell[0]);

                this.path.push(validNextCell[0]);
                this.makePath(validNextCell[1] as CellData, validNextCell[0]);
            } else if (!validNextCell) {
                prevCellExit === 'entrance' ? currentCell.validDirections.push('entrance') :
                prevCellExit === 'left' ? currentCell.validDirections.push('right') :
                prevCellExit === 'right' ? currentCell.validDirections.push('left') :
                prevCellExit === 'top' ? currentCell.validDirections.push('bottom') :
                currentCell.validDirections.push('top');
                this.goBackOneCell(cell)
            }
        },
        goBackOneCell(cell:CellData) {
            if (this.isAllCellsVisited()) {
                return
            }

            const lastMove = this.path[this.path.length-1];
            const findPrevCell = this.cells.find( (el) => {
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
            this.path.pop();
            this.makePath(findPrevCell as CellData, this.path[this.path.length-1]);

        },
        isAllCellsVisited() {
            return this.cells.every( (el) => el.visited === true);
        },
        getUnvisitedCell(cell:CellData):string | null {
            const allDirections = cell.directions.filter(el=>el);
            const allDirectionsUnvisited = allDirections.map( (direction) => {
                if (direction === 'top') {
                    return [direction, this.cells.find( (el) => el.cellX === cell.cellX && el.cellY === cell.cellY-1 && !el.visited)]
                } else if (direction === 'bottom') {
                    return [direction, this.cells.find( (el) => el.cellX === cell.cellX && el.cellY === cell.cellY+1 && !el.visited)]
                } else if (direction === 'right') {
                    return [direction, this.cells.find( (el) => el.cellY === cell.cellY && el.cellX === cell.cellX+1 && !el.visited)]
                } else if (direction === 'left') {
                    return [direction, this.cells.find( (el) => el.cellY === cell.cellY && el.cellX === cell.cellX-1 && !el.visited)]
                }
            })

            const filterValid = allDirectionsUnvisited.filter( (el) => el[1]);
            const randomValidDirection = filterValid[Math.floor(Math.random()*filterValid.length)];

            if (randomValidDirection?.length) {
                return randomValidDirection as RandomValidDirectionType;
            } else {
                return null;
            }
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
