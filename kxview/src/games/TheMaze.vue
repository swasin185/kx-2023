<script lang="ts">
export default defineComponent({
    name: "TheMaze"
})
</script>

<script lang="ts" setup>
import { defineComponent, onMounted } from "vue"
import Maze2 from "./Maze2"

let sizeInput: HTMLInputElement
let sizeSlider: HTMLInputElement
let connInput: HTMLInputElement
let connSlider: HTMLInputElement
let delayInput: HTMLInputElement
let delaySlider: HTMLInputElement
let waiting: HTMLInputElement
let maze: Maze2

onMounted(() => {
    sizeInput = document.getElementById("sizeInput") as HTMLInputElement
    sizeSlider = document.getElementById("sizeSlider") as HTMLInputElement
    connInput = document.getElementById("connInput") as HTMLInputElement
    connSlider = document.getElementById("connSlider") as HTMLInputElement
    delayInput = document.getElementById("delayInput") as HTMLInputElement
    delaySlider = document.getElementById("delaySlider") as HTMLInputElement
    waiting = document.getElementById("waiting") as HTMLInputElement
    maze = new Maze2("maze2", Number(sizeInput.value))
})

function genMaze(): void {
    maze.init(Number(sizeInput.value))
    maze.generate(Number(connInput.value), Number(delayInput.value))
}
function clickXY(event: MouseEvent): void {
    maze.clickXY(event)
}
</script>

<template>
    <div
        id="toolbar"
        style="
            background: white;
            width: 180px;
            float: left;
            padding: 10px 10px;
            border: 2px solid;
            margin: 20px;
        "
    >
        <label id="sizeLabel" for="sizeInput">Size:</label>
        <input
            type="number"
            id="sizeInput"
            min="10"
            max="660"
            step="10"
            value="500"
            style="width: 50px; float: right; text-align: right"
        />
        <input
            type="range"
            id="sizeSlider"
            min="10"
            max="660"
            step="10"
            value="500"
            @input="sizeInput.value = sizeSlider.value"
        />
        <label id="connectLabel" for="connInput">Connect:</label>
        <input
            type="number"
            id="connInput"
            min="0"
            max="1"
            step="0.1"
            value="0.5"
            style="width: 50px; float: right; text-align: right"
        />
        <input
            type="range"
            id="connSlider"
            min="0"
            max="1"
            step="0.1"
            value="0.5"
            @input="connInput.value = connSlider.value"
        />
        <br />
        <label id="delayLabel" for="delayInput">Delay:</label>
        <input
            type="number"
            id="delayInput"
            min="0"
            max="100"
            step="1"
            value="10"
            style="width: 50px; float: right; text-align: right"
        />
        <input
            type="range"
            id="delaySlider"
            min="0"
            max="100"
            step="1"
            value="10"
            @input="delayInput.value = delaySlider.value"
        />
        <br />
        <label for="wait">waiting</label>
        <input type="checkbox" id="waiting" checked="true" />
        <hr />
        <input type="button" class="button" id="generate" value="Generate" @click="genMaze()" />
        <br />
        <input type="button" class="button" id="reset" value="Reset" @click="maze.reset()" />
        <br />
        <input
            type="button"
            class="button"
            value="Run"
            @click="maze.solveMaze(Number(delayInput.value), waiting.checked)"
        />
        <br />
    </div>
    <canvas
        id="maze2"
        width="800"
        height="600"
        style="background-color: darkslategrey; color: white; margin-top: 20px"
        @click="clickXY"
    ></canvas>
</template>
<style scoped>
.button {
    text-align: center;
    background-color: #0354ae;
    padding: 10px 20px;
    border: 2px solid;
    border-radius: 0.5rem;
    margin-top: 5px;
    margin-bottom: 5px;
    color: cyan;
    cursor: pointer;
    font-size: 16px;
    width: 160px;
}
</style>
