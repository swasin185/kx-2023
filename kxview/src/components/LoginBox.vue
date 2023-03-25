<script lang="ts">
export default {
    name: "Login"
}
</script>

<script setup lang="ts">
import { ref } from "vue"
import Client from "../Client"
import ShareLib from "../../../kxserv/src/shared/ShareLib"
import InputText from "primevue/inputtext"
import { useToast } from "primevue/usetoast"

const toast = useToast()

const password = ref<string>("")
const hidePwd = ref<boolean>(true)

function pressLogin() {
    if (Client.getSession().level > -1)
        Client.service.post("logout").then((res) => {
            Client.setupSession(res.data)
            password.value = ""
            window.location.reload()
        })
    else
        Client.service
            .post("login", {
                user: Client.getSession().user,
                password: ShareLib.encode(password.value)
            })
            .then((res) => {
                Client.setupSession(res.data)
                Client.drawerOpen.value = Client.getSession().level > -1

                if (Client.getSession().level == -1) {
                    document.getElementById("password")?.focus()
                    toast.add({
                        severity: "error",
                        summary: "ชื่อรหัสผ่านผิดพลาด",
                        detail: "ชื่อผู้ใช้ หรือ รหัสผ่านผิดพลาด ไม่สามารถเข้าระบบได้",
                        life: 3000
                    })
                } else password.value = ""
            })
}
</script>

<template>
    <div
        :style="{
            height: 'auto',
            padding: '5px',
            'border-radius': '5px'
            // border: '1px darkgray solid'
        }"
    >
        <span class="p-input-icon-right mb-1">
            <InputText
                id="user"
                placeholder="ชื่อ-ล็อคอิน"
                v-model="Client.getSession().user"
                type="text"
                maxlength="16"
                @keydown.enter="Client.nextFocus($event)"
                tabindex="1"
                :disabled="Client.getSession().loginTime != null"
                autofocus
                required
            />
            <i
                :class="Client.getSession().level == -1 ? 'pi pi-user' : 'pi pi-sign-out'"
                @click="pressLogin"
            />
        </span>
        <span class="p-input-icon-right" v-if="Client.getSession().level == -1">
            <InputText
                id="password"
                placeholder="รหัสผ่าน"
                v-model="password"
                :type="hidePwd ? 'password' : 'text'"
                maxlength="16"
                tabindex="2"
                @keydown.enter="pressLogin"
            />
            <i :class="hidePwd ? 'pi pi-eye-slash' : 'pi pi-eye'" @click="hidePwd = !hidePwd" />
        </span>
        <h3 class="ml-1" v-else @click="pressLogin">
            {{ Client.getSession().name }}
        </h3>
    </div>
</template>
