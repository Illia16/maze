<template>
    <div
        class="mini-game p-16 flex flex-col justify-center items-center space-y-5"
    >
        <NuxtLink to="/" class="go-back-link">&#8592;</NuxtLink>
        <h1 class="text-pink-400 font-bold text-3xl w-52">
            Get the equal amount in all 3 glasses
        </h1>
        <h2 class="text-pink-400 font-bold text-2xl">The purpose of this is to see how setTimeout functions work together.</h2>
        <div class="h-12">
            <select name="difficulty" id="difficulty" v-model="timeOut" v-if="totalAmount===userAmount">
                <option :value=0>Select difficulty</option>
                <option :value=500>Easy</option>
                <option :value=250>Medium</option>
                <option :value=100>Hard</option>
            </select>
        </div>
        <button @click="setHideBottle" class="hide-bottle">Show/Hide bottle</button>

        <button
            @mousedown.prevent="holdBtn"
            @mouseup.prevent="holdBtn"
            @touchstart.prevent='holdBtn'
            @touchend.prevent='holdBtn'
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

        <div class="flex space-x-5 md:space-x-10 items-end">
            <div class="w-16 h-[27rem] md:w-52 md:h-96">
                <div v-if="!hideBottle" class="bottle">
                    <div class="bottle-top"></div>
                    <div class="bottle-mid"></div>
                    <div class="bottle-bottom" :style="{height: userAmount + 'px'}">
                        <div :style="{height: totalAmount + 'px'}"></div>
                    </div>
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
        [key:string]:number,
    };
    hideBottle: boolean,
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
            hideBottle: false,
            gameOver: false,
            gameWon: false
        };
    },
    methods: {
        holdBtn(e: KeyboardEvent) {
            if ((e.type === "mousedown") || (e.type === 'touchstart')) {
                console.log('mousedown');
                this.checkIfGameOver()
                this.isMouseDown = true;
                this.timer = window.setInterval(this.pourDown, this.timeOut);
            } else if ((e.type === "mouseup") || (e.type === 'touchend')) {
                console.log('mouseup');
                this.checkIfGameOver()
                this.isMouseDown = false;
                this.bottleAnimation(this.isMouseDown);
                this.nextGlass();
                clearInterval(this.timer);
            }
        },
        pourDown() {
            this.bottleAnimation(this.isMouseDown);
            this.totalAmount = this.totalAmount - this.step;
            this.glasses[`glass${this.currentGlass}`] += this.step;
        },
        checkIfGameOver() {
            if (this.totalAmount === 0) {
                clearInterval(this.timer);
                this.gameOver = true;
                if (
                    this.glasses.glass1 === this.userAmount / 3 &&
                    this.glasses.glass2 === this.userAmount / 3 &&
                    this.glasses.glass3 === this.userAmount / 3
                ) {
                    this.gameWon = true;
                }
            }
        },
        nextGlass() {
            if (this.currentGlass === 3) {
                this.currentGlass = 1;
            } else {
                this.currentGlass++;
            }
        },
        bottleAnimation(position:boolean) {
            const bottle = document.querySelector('.bottle');
            if (position) {
                if (bottle) {
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
            } else {
                if (bottle) bottle.classList.value = 'bottle';
            }
        },
        setHideBottle(){
            this.hideBottle = !this.hideBottle;
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
            this.checkIfGameOver()
        }
    }
});
</script>

<style lang="scss" scoped>
.mini-game {
    @apply bg-black min-h-screen;

    .hide-bottle,
    .go-back-link,
    select,
    .pour-btn,
    .start-over-btn {
        @apply bg-pink-400 w-52 h-12 text-center border-2 border-transparent;

        &:hover:not(:disabled),
        &:focus:not(:disabled) {
            @apply bg-transparent border-2 border-pink-400 text-white;
        }
    }

    .go-back-link {
        @apply fixed top-4 left-4 w-12 h-6 text-sm;
    }

    .game-over {
        @apply absolute py-5 px-8 bg-pink-300 border-4 border-pink-300 w-[300px] h-[150px] flex flex-col justify-center items-center z-20;
        left: calc(50% - 300px/2);
        top: calc(50% - 150px/2);
        h2 {
            @apply text-pink-400 font-bold text-3xl text-center;
        }
    }

    .pour-btn {
        &:disabled {
            background: rgb(244, 114, 182, 50%);
        }
    }

    .bottle {
        @apply flex flex-col justify-end mr-2 md:mr-20;
        transition: all 1s ease;
        .bottle-top {
            @apply h-24 w-5 md:w-10 border-4 mx-auto border-b-0 translate-y-1 md:transform-none;
            background: rgba(153, 92, 80, 0.2);
        }
        .bottle-mid {
            @apply h-12 w-14 md:w-32 border-4 border-b-0 rounded-t-full;
            background: rgba(153, 92, 80, 0.2);
        }
        .bottle-bottom {
            @apply flex items-end w-14 md:w-32 border-4 border-t-0 rounded-b-3xl overflow-hidden;
            background: rgba(153, 92, 80, 0.2);
            div {
                @apply w-full bg-red-700 opacity-70 relative;
                transition: height 0.75s ease;
            }
        }


        &.glass-1 {
            transform: rotate(70deg) translateX(0) translateY(130px);
            @screen md {
                transform: rotate(70deg) translateX(-125px) translateY(-75px);
            }
        }

        &.glass-2 {
            transform: rotate(70deg) translateX(-47px) translateY(59px);
            @screen md {
                transform: rotate(70deg) translateX(-50px) translateY(-250px);
            }
        }

        &.glass-3 {
            transform: rotate(70deg) translateX(-25px) translateY(-10px);
            @screen md {
                transform: rotate(70deg) translateX(-25px) translateY(-400px);
            }
        }
    }

    .glass {
        @apply flex flex-col items-center;
        .glass-top {
            @apply flex items-end w-12 md:w-32 h-[120px] border-4 rounded-t-lg rounded-b-[50px] overflow-hidden;
            background: rgba(128, 168, 194, 0.2);

            .glass-inner {
                @apply w-full bg-red-700 opacity-70 relative;
                transition: height 0.75s ease;
            }
        }
        .glass-bottom {
            @apply block h-24 w-[6px] bg-white relative;

            &:after {
                content: "";
                @apply w-10 h-6 md:w-24 md:h-12 top-20 absolute;
                border-radius: 100px / 50px;
                right: calc(-20px + 3px);
                background: rgb(235, 229, 229);

                @screen md {
                    right: calc(-48px + 3px);
                }
            }
        }
    }
}
</style>
