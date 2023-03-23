<script lang="ts">
export default defineComponent({
    name: "Permission"
})
</script>

<script lang="ts" setup>
import Client from "../Client"
import { defineComponent } from "vue"
import PickList from "primevue/picklist"
</script>

<template>
    <PickList />
</template>
