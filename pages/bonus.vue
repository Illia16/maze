<template>
    <div>
        <button @mousedown.prevent="pushDown" @mouseup.prevent="pushDown">
            HOLD
        </button>
    </div>
</template>

<script lang="ts">

declare interface MiniGame {
    isMouseDown: boolean,
    currentGlass: number,
    totalAmount: number,
    glass1: number,
    glass2: number,
    glass3: number
}

import Vue from "vue";
export default Vue.extend({
    data(): MiniGame {
        return {
            isMouseDown: false,
            currentGlass: 1,
            totalAmount: 120,
            glass1: 0,
            glass2: 0,
            glass3: 0
        };
    },
    methods: {
        pushDown(e) {
            if (e.type === "mousedown") {
                this.isMouseDown = true;
                console.log(this.isMouseDown);
                let timer = setInterval( () => {
                    this.totalAmount = this.totalAmount - 5;
                    this.whatGlass(this.currentGlass);
                    if (!this.isMouseDown) {
                        this.currentGlass++
                        clearInterval(timer)
                    }
                },[1000])
            } else if (e.type === "mouseup") {
                this.isMouseDown = false;
                 console.log(this.isMouseDown);
            }
        },
        whatGlass(glassNum:number):void {
            this[`glass${glassNum}`] = this[`glass${glassNum}`] + 5;
        }
    },
    watch: {
        totalAmount: function(val, oldVal) {
            console.log('val', val);
        }
    }
});
</script>
