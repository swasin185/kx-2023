<script lang="ts">
const user = ref("")
const password = ref("")
const program = ref("")
const verify = ref<boolean>(false)
let resolve: (data: string) => void

async function execute() {
    if (Client.connection.value.loginTime != null)
        return new Promise((res) => {
            program.value = Client.current.value.program
            user.value = Client.connection.value.user || ""
            password.value = ""
            verify.value = true
            resolve = res
        })
    else return null
}

export default {
    methods: {
        execute
    }
}
</script>

<script setup lang="ts">
import Client from "../Client"
import ShareLib from "../../../kxserv/src/shared/ShareLib"
import Dialog from "primevue/dialog"
import Button from "primevue/button"
import InputText from "primevue/inputtext"
import { ref } from "vue"

const hidePwd = ref(true)

function close(result: string): void {
    verify.value = false
    resolve(result)
}

function pressVerify() {
    if (user.value)
        Client.service
            .post("verifyLevel", {
                user: user.value,
                password: ShareLib.encode(password.value),
                program: program.value
            })
            .then((res) => {
                Client.current.value.supervisor = user.value
                Client.current.value.superlevel = res.data
                close(res.data)
            })
}
</script>

<template>
    <Dialog
        v-model:visible="verify"
        contentStyle="width:var(--menuwidth)"
        :closeOnEscape="false"
        :closable="false"
        :showHeader="false"
        modal
    >
        <div class="grid text-center">
            <div class="col-12">ยืนยันสิทธิ</div>
            <div class="col-12">
                <span class="p-input-icon-right">
                    <InputText
                        id="user"
                        title="ชื่อผู้ควบคุม"
                        placeholder="supervisor"
                        v-model="user"
                        type="text"
                        maxlength="16"
                        @keydown.enter="Client.nextFocus($event)"
                        tabindex="1"
                    />
                    <i class="pi pi-user-edit" />
                </span>
            </div>
            <div class="col-12">
                <span class="p-input-icon-right">
                    <InputText
                        id="password"
                        title="รหัสผ่าน 2"
                        placeholder="password 2"
                        v-model="password"
                        :type="hidePwd ? 'password' : 'text'"
                        maxlength="16"
                        @keydown.enter="pressVerify"
                        tabindex="2"
                    />
                    <i
                        :class="hidePwd ? 'pi pi-eye-slash' : 'pi pi-eye'"
                        @click="hidePwd = !hidePwd"
                    />
                </span>
            </div>
        </div>
        <template #footer>
            <div class="text-center">
                <Button type="button" label="Cancel" icon="pi pi-times" @click="close('')" />
                <Button type="submit" label="OK" icon="pi pi-check" @click="pressVerify" />
            </div>
        </template>
    </Dialog>
</template>
