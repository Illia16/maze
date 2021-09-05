<template>
    <div
        class="mini-game p-16 flex flex-col justify-center items-center space-y-20"
    >
        <h1 class="text-pink-400 font-bold text-3xl">
            Get the equal amount of wine in all 3 glasses
        </h1>
        <button
            @mousedown.prevent="pushDown"
            @mouseup.prevent="pushDown"
            class="bg-pink-400 py-3 px-16"
        >
            HOLD
        </button>

        <div class="flex space-x-10">
            <div v-for="(glassValue, glass, index) in glasses" :key="index" class="text-white">
                <div :class="[`glass glass-${index}`]">
                    <div
                        :class="[`glass-inner glass-${index}-inner`]"
                        :style="{ height: glassValue ? glassValue + 'px' : '0' }"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
declare interface MiniGame {
    isMouseDown: boolean;
    currentGlass: number;
    totalAmount: number;
    userAmount: number;
    glasses: {
        glass1: number,
        glass2: number,
        glass3: number,
    };
    gameOver: boolean,
}

import Vue from "vue";
export default Vue.extend({
    data(): MiniGame {
        return {
            isMouseDown: false,
            currentGlass: 1,
            userAmount: 120,
            totalAmount: 120,
            glasses: {
                glass1: 0,
                glass2: 0,
                glass3: 0
            },
            gameOver: false,
        };
    },
    mounted: function() {
        console.log(this);
    },
    methods: {
        pushDown(e: KeyboardEvent) {
            if (this.totalAmount === 0) {
                return
            };

            if (e.type === "mousedown") {
                this.isMouseDown = true;
                let timer = setInterval(() => {
                    this.totalAmount = this.totalAmount - 5;
                    this.getCurrentGlass(this.currentGlass);
                    if (!this.isMouseDown) {
                        if (this.currentGlass === 3){
                            this.currentGlass = 1;
                        } else {
                            this.currentGlass++;
                        }
                        clearInterval(timer);
                    }

                    if (this.totalAmount === 0) {
                        clearInterval(timer);
                    };
                }, [100]);
            } else if (e.type === "mouseup") {
                this.isMouseDown = false;
            }
        },
        getCurrentGlass(glassNum: number): void {
            this.glasses[`glass${glassNum}`] = this.glasses[`glass${glassNum}`] + 5;
        }
    },
    watch: {
        totalAmount: function() {
            console.log('total', this.totalAmount);

            if (this.glasses.glass1 && this.glasses.glass2 && this.glasses.glass3 === this.userAmount/3) {
                console.log('WIN!');
                this.gameOver = true;
            } else if ((this.glasses.glass1 || this.glasses.glass2 || this.glasses.glass3 !== this.userAmount/3) && (this.glasses.glass1 && this.glasses.glass2 && this.glasses.glass3 !== 0))  {
                console.log('LOOSE!');
            }


            // if (this.totalAmount === 0) {
            //     document.querySelector('button').removeEventListener('mousedown')
            // }
        }
    },
    // watch: {
    //     totalAmount: function(val, oldVal) {
    //         console.log("val", val);
    //     }
    // }
});
</script>

<style lang="scss" scoped>
.mini-game {
    @apply bg-black;

    .glass {
        @apply flex items-end w-32 h-[120px] border-2;
        .glass-inner {
            @apply w-full bg-red-700;
            transition: height 0.3s ease;
        }
    }
}
</style>
