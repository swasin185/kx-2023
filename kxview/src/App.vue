<script lang="ts">
export default defineComponent({
    name: "App",
    components: Components
})
</script>

<script lang="ts" setup>
import SideBar from "primevue/sidebar"
import Menu from "primevue/panelmenu"
import Button from "primevue/button"
import Dialog from "primevue/dialog"
import ServerClock from "./components/ServerClock.vue"
import StatusBar from "./components/StatusBar.vue"
import DlgVerify from "./components/DlgVerify.vue"
import Client from "./Client"
import Components from "./import"
import LoginBox from "./components/LoginBox.vue"
import Toast from "primevue/toast"
import { ref, defineComponent, provide, onMounted } from "vue"
const dlgVerify = ref<any>(null)
provide("dlgVerify", dlgVerify)
onMounted(() => Client.checkSession("Login"))
</script>

<template>
    <SideBar v-model:visible="Client.drawerOpen.value" position="left" style="width: auto">
        <Menu :model="Client.MENU_ITEMS.value" class="main-menu"> </Menu>
    </SideBar>
    <div class="flex main-header" :style="{ background: Client.getSession().color }">
        <div class="col-2">
            <Button
                class="main-button"
                label="Back"
                icon="pi pi-fast-backward"
                @click="Client.backPanel"
            />
        </div>
        <h1 class="col-8 text-center" style="padding: 0">
            {{ Client.getSession().comName }}
            <br />
            <div style="font-size: large" v-show="Client.current.value.level > -1">
                {{ Client.current.value.pgmName }} [ {{ Client.current.value.level }} ]
            </div>
        </h1>
        <LoginBox class="col-2" />
    </div>

    <div class="main-panel">
        <keep-alive>
            <component :is="Client.getPanel()" />
        </keep-alive>
    </div>
    <div class="flex main-footer" :style="{ background: Client.getSession().color }">
        <div class="col-9 text-left" style="padding: 4px">
            <StatusBar />
        </div>
        <div class="col-3 text-right" style="padding: 5px">
            <ServerClock />
        </div>
    </div>
    <Dialog
        v-model:visible="Client.waitting.value"
        position="bottom"
        modal
        :close-on-escape="false"
        :closable="false"
    >
        <template #default><i class="pi pi-spin pi-sync" />กำลังติดต่อเซิฟเวอร์</template>
    </Dialog>

    <DlgVerify ref="dlgVerify" />

    <Toast position="center" />
</template>
s
