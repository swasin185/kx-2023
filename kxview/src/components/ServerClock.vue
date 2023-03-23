<template>
    {{ ShareLib.formatDate(new Date(Client.getSession().serverTime || 0)) }}
    <i class="pi pi-calendar" />
</template>

<script setup lang="ts">
import ShareLib from "../../../kxserv/src/shared/ShareLib"
import Client from "../Client"
// import { ref, watch } from "vue"
// watch(Client.connection, (newValue) => {
//   time = newValue.serverTime
//   timeText.value = ShareLib.formatDateTime(new Date(time))
// })
// 1
// const PERIOD = 60000
// let time = 0
// const timeText = ref<string>("00/00/00 [00:00]")
// setInterval(() => {
//   time += PERIOD
//   timeText.value = ShareLib.formatDateTime(new Date(time))
// }, PERIOD)
</script>
