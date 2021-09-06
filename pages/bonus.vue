<template>
    <div
        class="mini-game p-16 flex flex-col justify-center items-center space-y-10"
    >
        <NuxtLink to="/" class="go-back-link">Go back</NuxtLink>
        <h1 class="text-pink-400 font-bold text-3xl">
            Get the equal amount in all 3 glasses
        </h1>
        <div class="h-12">
            <select name="difficulty" id="difficulty" v-model="timeOut" v-if="totalAmount===userAmount">
                <option :value=0>Select difficulty</option>
                <option :value=500>Easy</option>
                <option :value=250>Medium</option>
                <option :value=100>Hard</option>
            </select>
        </div>
        <button
            @mousedown.prevent="pushDown"
            @mouseup.prevent="pushDown"
            class="pour-btn"
            :disabled="gameOver || !timeOut"
        >
            POUR
        </button>

        <div v-if="gameOver" class="game-over">
            <h2 v-if="gameWon">Victory!</h2>
            <h2 v-if="!gameWon">Defeat!</h2>
            <button @click="startOver" class="start-over-btn">Start Over</button>
        </div>

        <div class="flex space-x-10 items-end">
            <div class="bottle">
                <div class="bottle-top"></div>
                <div class="bottle-mid"></div>
                <div class="bottle-bottom" :style="{height: userAmount + 'px'}">
                    <div :style="{height: totalAmount + 'px'}"></div>
                </div>
            </div>
            <div
                v-for="(glassValue, glass, index) in glasses"
                :key="index"
                class="glass text-white"
            >
                <div :class="[`text-white glass-top glass-${index}`]">
                    <div
                        :class="[`glass-inner glass-${index}-inner`]"
                        :style="{
                            height: glassValue ? glassValue + 'px' : '0'
                        }"
                    ></div>
                </div>
                <div class="glass-bottom"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
declare interface MiniGame {
    timer: number;
    timeOut: number;
    isMouseDown: boolean;
    currentGlass: number;
    userAmount: number;
    totalAmount: number;
    step: number;
    glasses: {
        glass1: number;
        glass2: number;
        glass3: number;
    };
    gameOver: boolean;
    gameWon: boolean;
}

import Vue from "vue";
export default Vue.extend({
    data(): MiniGame {
        return {
            timer: 0,
            timeOut: 0,
            isMouseDown: false,
            currentGlass: 1,
            userAmount: 300,
            totalAmount: 300,
            step: 20,
            glasses: {
                glass1: 0,
                glass2: 0,
                glass3: 0
            },
            gameOver: false,
            gameWon: false
        };
    },
    mounted: function() {
        console.log(this);
    },
    methods: {
        pushDown(e: KeyboardEvent) {
            if (this.totalAmount === 0) {
                this.gameOver = true;
                return;
            }
            console.log('e', e);


            if (e.type === "mousedown") {
                this.isMouseDown = true;
                this.timer = setInterval(this.pour, [this.timeOut]);
            } else if (e.type === "mouseup") {
                this.isMouseDown = false;
            }
        },
        pour() {
            this.bottleAnimation();
            this.pourInCurrentGlass(this.currentGlass);
            if (!this.isMouseDown) {
                if (this.currentGlass === 3) {
                    this.currentGlass = 1;
                } else {
                    this.currentGlass++;
                }
                clearInterval(this.timer);
            }

            if (this.totalAmount === 0) {
                clearInterval(this.timer);
            }
        },
        bottleAnimation() {
            const bottle = document.querySelector('.bottle');
            if (bottle) {
                bottle.classList.value = 'bottle';
                switch (this.currentGlass) {
                    case 1:
                        bottle.classList.add('glass-1')
                        break;
                    case 2:
                        bottle.classList.add('glass-2')
                        break;
                    default:
                        bottle.classList.add('glass-3')
                        break;
                }
            }
        },
        pourInCurrentGlass(glassNum: number): void {
            this.totalAmount = this.totalAmount - this.step;
            if (glassNum === 1) {
                this.glasses.glass1 += this.step;
            } else if (glassNum === 2) {
                this.glasses.glass2 += this.step;
            } else {
                this.glasses.glass3 += this.step;
            }
            // TO DO, figure out how to fix TS warning;
            // this.glasses[`glass${glassNum}`] =
                // this.glasses[`glass${glassNum}`] + 5;
        },
        startOver() {
            const bottle = document.querySelector('.bottle');
            if (bottle) bottle.classList.value = 'bottle';

            this.currentGlass = 1;
            this.gameOver = false;
            this.gameWon = false;
            this.totalAmount = this.userAmount;
            this.glasses.glass1 = 0;
            this.glasses.glass2 = 0;
            this.glasses.glass3 = 0;
        }
    },
    watch: {
        totalAmount: function() {
            console.log("total", this.totalAmount);
            if (this.totalAmount === 0) {
                if (
                    this.glasses.glass1 &&
                    this.glasses.glass2 &&
                    this.glasses.glass3 === this.userAmount / 3
                ) {
                    console.log("WIN!");
                    this.gameOver = true;
                    this.gameWon = true;
                } else {
                    console.log('LOOSE!');
                    this.gameOver = true;
                }
            }
        }
    }
});
</script>

<style lang="scss" scoped>
.mini-game {
    @apply bg-black min-h-screen;

    .go-back-link,
    select,
    .pour-btn,
    .start-over-btn {
        @apply bg-pink-400 py-3 px-16 border-2 border-transparent;

        &:hover:not(:disabled),
        &:focus:not(:disabled) {
            @apply bg-transparent border-2 border-pink-400 text-white;
        }
    }

    .game-over {
        @apply absolute py-5 px-8 bg-pink-300 border-4 border-pink-300 w-[300px] h-[150px] flex flex-col justify-center items-center z-20;
        left: calc(50% - 300px/2);
        top: calc(50% - 150px/2);
        h2 {
            @apply text-pink-400 font-bold text-3xl text-center;
        }
    }

    .go-back-link {
        @apply fixed top-4 left-4 uppercase p-3;
    }

    .pour-btn {
        &:disabled {
            background: rgb(244, 114, 182, 50%);
        }
    }

    .bottle {
        @apply flex flex-col justify-end mr-20;
        transition: all 0.3s ease;
        .bottle-top {
            @apply h-24 w-10 border-4 mx-auto border-b-0;
            background: rgba(153, 92, 80, 0.2);
        }
        .bottle-mid {
            @apply h-12 w-32 border-4 border-b-0 rounded-t-full;
            background: rgba(153, 92, 80, 0.2);
        }
        .bottle-bottom {
            @apply flex items-end w-32 border-4 border-t-0 rounded-b-3xl overflow-hidden;
            background: rgba(153, 92, 80, 0.2);
            div {
                @apply w-full bg-red-700 opacity-70 relative;
                transition: height 0.3s ease;
            }
        }


        &.glass-1 {
            transform: rotate(70deg) translateX(-125px) translateY(-75px);
        }

        &.glass-2 {
            transform: rotate(70deg) translateX(-50px) translateY(-250px);
        }

        &.glass-3 {
            transform: rotate(70deg) translateX(-25px) translateY(-400px);
        }
    }

    .glass {
        @apply flex flex-col items-center;
        .glass-top {
            @apply flex items-end w-32 h-[120px] border-4 rounded-t-lg rounded-b-[50px] overflow-hidden;
            background: rgba(128, 168, 194, 0.2);

            .glass-inner {
                @apply w-full bg-red-700 opacity-70 relative;
                transition: height 0.3s ease;
            }
        }
        .glass-bottom {
            @apply block h-24 w-[6px] bg-white relative;

            &:after {
                content: "";
                @apply w-24 h-12 top-20 absolute;
                border-radius: 100px / 50px;
                right: calc(-48px + 3px);
                background: rgb(235, 229, 229);
            }
        }
    }
}
</style>
