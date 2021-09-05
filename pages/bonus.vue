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
            <div class="glass glass-1">
                <div
                    :class="['glass-inner glass-1-inner']"
                    :style="{ height: glass1 ? glass1 + 'px' : '0' }"
                ></div>
            </div>

            <div class="glass glass-2">
                <div
                    :class="['glass-inner glass-2-inner']"
                    :style="{ height: glass2 ? glass2 + 'px' : '0' }"
                ></div>
            </div>

            <div class="glass glass-3">
                <div
                    :class="['glass-inner glass-3-inner']"
                    :style="{ height: glass3 ? glass3 + 'px' : '0' }"
                ></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
declare interface MiniGame {
    isMouseDown: boolean;
    currentGlass: number;
    totalAmount: number;
    glass1: number;
    glass2: number;
    glass3: number;
}

import Vue from "vue";
export default Vue.extend({
    data(): MiniGame {
        return {
            isMouseDown: false,
            currentGlass: 1,
            totalAmount: 120,
            // glasses: {
            //     glass1: 0,
            //     glass2: 0,
            //     glass3: 0
            // },
            glass1: 0,
            glass2: 0,
            glass3: 0
        };
    },
    mounted: () => {
        console.log(this);
    },
    methods: {
        pushDown(e: KeyboardEvent) {
            if (e.type === "mousedown") {
                this.isMouseDown = true;
                console.log(this.isMouseDown);
                let timer = setInterval(() => {
                    this.totalAmount = this.totalAmount - 5;
                    this.getCurrentGlass(this.currentGlass);
                    if (!this.isMouseDown) {
                        this.currentGlass++;
                        clearInterval(timer);
                    }
                }, [50]);
            } else if (e.type === "mouseup") {
                this.isMouseDown = false;
                console.log(this.isMouseDown);
            }
        },
        getCurrentGlass(glassNum: number): void {
            this[`glass${glassNum}`] = this[`glass${glassNum}`] + 5;
        }
    },
    watch: {
        totalAmount: function(val, oldVal) {
            console.log("val", val);
        }
    }
});
</script>

<style lang="scss" scoped>
.mini-game {
    @apply bg-black;

    .glass {
        @apply flex items-end w-32 h-44 border-2;
        .glass-inner {
            @apply w-full bg-red-700;
            transition: height 0.3s ease;
        }
    }
}
</style>
