<template>
    <div
        class="maze-main relative flex flex-col items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0"
    >
        <div class="go-to-bonus">
            <NuxtLink to="/bonus">Bonus game</NuxtLink>
        </div>
        <div class="mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow sm:rounded-lg p-6">
                <h1 class="text-2xl leading-7 font-semibold mb-6 text-center">Maze</h1>
                <div v-if="genMazeLoading">Generating maze...</div>
                <div v-if="gameStarted">
                    <div>Level {{level}}</div>
                    <div class="maze flex flex-wrap" :style="{width: cellNumbersX*25+2+'px'}">
                        <template v-for="(cell, index) in cells">
                            <Cell :cellData='cell' :playerPositionPropName='playerPosition' :maxX='cellNumbersX' :maxY='cellNumbersY' :key="index" />
                        </template>
                    </div>
                        <div  class="arrow-buttons">
                        <button value="top" @click="playerMoveHandler">&#8593;</button>
                        <button value="right" @click="playerMoveHandler">&#8594;</button>
                        <button value="bottom" @click="playerMoveHandler">&#8595;</button>
                        <button value="left" @click="playerMoveHandler">&#8592;</button>
                    </div>
                    <p class="text-xs text-center">Use keyboard arrows to move.</p>
                </div>
                <div v-else class="text-center">
                    <button v-if="!gameStarted" @click="startGame" class="bg-yellow-600 py-3 px-4">Start the game</button>
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
    level: number,
    playerPosition: Array<number>,
    cells: Array<CellData>,
    cellNumbersX: number,
    cellNumbersY: number,
    gameStarted: boolean,
    genMazeLoading: boolean,
    path: Array<string>,
}

type getUnvisitedCellType = RandomValidDirectionType | null;
type RandomValidDirectionType = ValidDirectionType;

interface ValidDirectionType {
    length: number,
    direction: string[];
    data: CellData;
}

type SingleAllDirectionsUnvisited = Array<string | undefined | CellData>;
type AllDirectionsUnvisited = Array<SingleAllDirectionsUnvisited>;
type SingleFilterValidArr = Array<string | CellData>;
type FilterValidArr = Array<SingleFilterValidArr>;

export default Vue.extend({
    data():MainGameData {
        return {
            level: 1,
            playerPosition: [1, 1],
            cells: [],
            cellNumbersX: 5,
            cellNumbersY: 5,
            gameStarted: false,
            genMazeLoading: false,
            path: [],
        };
    },
    mounted() {
        this.genMaze()
    },
    methods: {
        genMaze() {
            this.cells = [];
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
        },
        makePath(cell:CellData, prevCellExit:string) {
            const currentCell = this.cells[this.cells.indexOf(cell)];

            // setting the exit
            if (cell.cellX === this.cellNumbersX && cell.cellY === this.cellNumbersY && !cell.visited) {
                currentCell.validDirections.push('exit');
            }
            // ////////////////

            currentCell.visited = true;
            const validNextCell:getUnvisitedCellType = this.getUnvisitedCell(cell); // checking for a valid next direction


            // setting entrance
            prevCellExit === 'entrance' ? currentCell.validDirections.push('entrance') :
            prevCellExit === 'left' ? currentCell.validDirections.push('right') :
            prevCellExit === 'right' ? currentCell.validDirections.push('left') :
            prevCellExit === 'top' ? currentCell.validDirections.push('bottom') :
            currentCell.validDirections.push('top');
            //

            if (validNextCell) {
                currentCell.validDirections.push(validNextCell[0]); // setting exit
                this.path.push(validNextCell[0]); // adding a step to the path
                this.makePath(validNextCell[1] as CellData, validNextCell[0]); // going to the next valid cell
            } else if (!validNextCell) {
                this.goBackOneCell(cell)
            }
        },
        goBackOneCell(cell:CellData) {
            if (this.isAllCellsVisited()) {
                this.genMazeLoading = false;
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
        getUnvisitedCell(cell:CellData):getUnvisitedCellType {
            const allDirections = cell.directions.filter(el=> el) as Array<string>;
            const allDirectionsUnvisited = allDirections.map( (direction:string) => {
                if (direction === 'top') {
                    return [direction, this.cells.find( (el) => el.cellX === cell.cellX && el.cellY === cell.cellY-1 && !el.visited)]
                } else if (direction === 'bottom') {
                    return [direction, this.cells.find( (el) => el.cellX === cell.cellX && el.cellY === cell.cellY+1 && !el.visited)]
                } else if (direction === 'right') {
                    return [direction, this.cells.find( (el) => el.cellY === cell.cellY && el.cellX === cell.cellX+1 && !el.visited)]
                } else if (direction === 'left') {
                    return [direction, this.cells.find( (el) => el.cellY === cell.cellY && el.cellX === cell.cellX-1 && !el.visited)]
                }
            }) as AllDirectionsUnvisited;

            const filterValid = allDirectionsUnvisited.filter((el) => el![1]) as FilterValidArr;
            const randomValidDirection = filterValid[Math.floor(Math.random()*filterValid.length)] as RandomValidDirectionType;

            if (randomValidDirection?.length) {
                return randomValidDirection;
            } else {
                return null;
            }
        },
        startGame() {
            this.gameStarted = true;
            this.genMazeLoading = true;
            this.playerPosition = [1, 1];
            this.path = [];
            const resetValidDirections = this.cells.map(el => {
                el.visited = false;
                el.validDirections = [];
                return el;
            })
            this.cells = resetValidDirections;

            this.makePath(this.cells[0], 'entrance');
            document.addEventListener('keydown', this.playerMoveHandler)
        },
        playerMoveHandler(e:Event) {
            const [playerX, playerY] = this.playerPosition;

            // getting current cell where player is
            const getCurrentPositionCell = this.cells.filter( (el:CellData) => {
                if ((el.cellX === playerX) && (el.cellY === playerY)){
                    return el;
                }
            }) as CellData;
            // ////////////////////////////////////

            // go top
            if ((e.which === 38) || (e.target.value === 'top')) {
                if (getCurrentPositionCell.validDirections && getCurrentPositionCell.validDirections.includes('top')) {
                    const newArr = [playerX, playerY-1]
                    this.playerPosition = newArr;
                }
            } else if ((e.which === 39) || (e.target.value === 'right')) { // go right
                if (getCurrentPositionCell.validDirections && getCurrentPositionCell.validDirections.includes('right')) {
                    const newArr = [playerX+1, playerY];
                    this.playerPosition = newArr;
                }
            } else if ((e.which === 40) || (e.target.value === 'bottom')) { // go bottom
                if (getCurrentPositionCell.validDirections && getCurrentPositionCell.validDirections.includes('bottom')) {
                    const newArr = [playerX, playerY+1];
                    this.playerPosition = newArr;
                }
            } else if ((e.which === 37) || (e.target.value === 'left')) { // go left
                if ( getCurrentPositionCell.validDirections && getCurrentPositionCell.validDirections.includes('left')) {
                    const newArr = [playerX-1, playerY];
                    this.playerPosition = newArr;
                }
            }
        },

        nextLevel() {
            this.level += 1;
            this.cellNumbersX += 1;
            this.cellNumbersY += 1;
            this.genMaze()
            this.startGame()
        },
    },
    destroyed() {
        document.removeEventListener('keydown', this.playerMoveHandler);
    },
    watch: {
        playerPosition: function(newPosition, oldPosition) {
            const [X, Y] = this.playerPosition;
            // checking if the last cell.
            if (X === this.cellNumbersX && Y === this.cellNumbersY) {
                if (this.level === 50) {
                    this.gameStarted = false;
                } else {
                    this.nextLevel();
                }
            }
        }
    },
});
</script>

<style lang="scss" scoped>
.maze-main {
    @apply overflow-x-scroll p-10;
    h1 {
        @apply text-3xl text-yellow-600;
    }


    .maze {
        @apply justify-center mb-10 mx-auto;

        .maze-cell {
            @apply w-[25px] h-[25px];
        }
    }

    .arrow-buttons {
        @apply relative w-36 h-36 mx-auto my-3;
        button {
            @apply border border-black bg-blue-100 p-2 absolute w-10 h-10;

            &:nth-child(1) {
                left: calc(50% - 2.5rem/2);
                @apply top-0;
            }
            &:nth-child(2) {
                top: calc(50% - 2.5rem/2);
                @apply right-0;
            }
            &:nth-child(3) {
                left: calc(50% - 2.5rem/2);
                @apply bottom-0;
            }
            &:nth-child(4) {
                top: calc(50% - 2.5rem/2);
                @apply left-0;
            }
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
