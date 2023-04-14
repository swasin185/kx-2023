<script lang="ts">
export default {
    name: "ServerStatus"
}
</script>

<script lang="ts" setup>
import Client from "../Client"
import { ref, onActivated, nextTick } from "vue"
import Chart from "primevue/chart"
import Button from "primevue/button"

onActivated(() => nextTick().then(refresh))

const chartData = ref({
    labels: [],
    datasets: [
        {
            label: "Memory (MB)",
            data: [],
            borderWidth: 1
        }
    ]
})

const chartOptions = ref({
    plugins: {
        title: {
            display: true,
            text: "Server Status"
        }
    },
    scales: {
        x: {
            ticks: {
                color: "white"
            },
            grid: {
                drawBorder: true
            }
        },
        y: {
            beginAtZero: false,
            ticks: {
                color: "white"
            },
            grid: {
                color: "darkgrey",
                drawBorder: true
            }
        }
    }
})

function refresh() {
    Client.service.post("serverMemory").then((res) => {
        chartData.value.labels = []
        chartData.value.datasets[0].data = []
        for (let att in res.data) {
            // console.log(att, res.data[att] / 0xfffff)
            chartData.value.labels.push(att as never)
            chartData.value.datasets[0].data.push((res.data[att] / 0xfffff) as never)
        }
    })
}
</script>

<template>
    <div class="p-toolbar">
        <Button class="tool-button" icon="pi pi-sync" label="Refresh" @click="refresh" />
    </div>
    <div class="p-card flex flex-column flex-wrap">
        <Chart
            type="bar"
            :data="chartData"
            :options="chartOptions"
            style="width: 50%; height: 50%"
        />
    </div>
</template>
