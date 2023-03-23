<script lang="ts">
export default defineComponent({
    name: "TestReport"
})
</script>

<script lang="ts" setup>
import { defineComponent } from "vue"
import Button from "primevue/button"
import kxreport from "../KxReport"
function callAPI(): void {
    const p: Record<string, string> = {
        //app: "",
        //db: "kxtest",
        report: "00-000",
        //comCode: "3",
        //comName: "",
        fromDate: "01/01/2021",
        toDate: "31/12/2021",
        fromId: "",
        toId: ""
    }
    kxreport.openJS(p)
}
function openURL(): void {
    kxreport.open("report=00-000&db=kxtest&comCode=3&fromDate=01/01/2021&toDate=31/12/2021")
}
</script>

<template>
    <div class="p-toolbar">
        <Button class="tool-button" icon="pi pi-file-pdf" label="callAPI" @click="callAPI" />
        <Button class="tool-button" icon="pi pi-print" label="openURL" @click="openURL" />
    </div>
</template>
