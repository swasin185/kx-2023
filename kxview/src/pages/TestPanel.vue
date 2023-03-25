<script lang="ts">
export default defineComponent({
    name: "TestReport"
})
</script>

<script lang="ts" setup>
import { ref, Ref, defineComponent, inject } from "vue"
import Button from "primevue/button"
import Client from "../Client"
const dlgVerify: Ref<any> = inject("dlgVerify") || ref("")
const colorList = [
    "Crimson",
    "DarkOrange",
    "Orchid",
    "DeepPink",
    "Green",
    "LightGreen",
    "LightBlue",
    "#103090",
    "#EECC00"
]
</script>
<template>
    <div class="p-toolbar">
        <Button class="tool-button" label="Test Report" @click="Client.setPanel('TestReport')" />
        <Button class="tool-button" label="Test Panel" @click="Client.setPanel('TestPanel')" />
        <Button class="tool-button" label="Confirm Dialog" />
        <Button class="tool-button" label="verify" @click="dlgVerify.execute()" />
    </div>
    <div
        class="p-card p-1 m-2 text-center"
        v-for="color in colorList"
        v-bind:key="color"
        :style="{ 'background-color': color, color: 'white' }"
    >
        <h1 class="col">{{ color }}</h1>
    </div>
</template>
