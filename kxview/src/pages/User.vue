<script lang="ts">
export default {
    name: "User"
}
</script>

<script lang="ts" setup>
import { ref, onActivated } from "vue"
import Client, { Mode } from "../Client"
import KxUser from "../../../kxserv/src/shared/KxUser"
import InputText from "primevue/inputtext"
import DataTable from "primevue/datatable"
import Calendar from "primevue/calendar"
import Column from "primevue/column"
import Dropdown from "primevue/dropdown"
import Button from "primevue/button"
import { useConfirm } from "primevue/useconfirm"

const confirm = useConfirm()
const dt = ref<any>(null)
const user = ref<KxUser>(new KxUser())
const userList = ref<KxUser[]>([])
const columns = [
    {
        field: "user",
        header: "ชื่อล็อคอิน",
        width: "150px",
        readonly: true,
        maxlength: 16,
        type: "text"
    },
    {
        field: "name",
        header: "ชื่อนามสกุล",
        width: "200px",
        readonly: false,
        maxlength: 40,
        type: "text"
    },
    {
        field: "descript",
        header: "รายละเอียด",
        width: "300px",
        readonly: false,
        maxlength: 60,
        type: "text"
    },
    {
        field: "level",
        header: "ระดับสิทธิ",
        width: "150px",
        readonly: false,
        maxlength: 1,
        type: "code"
    },
    {
        field: "role",
        header: "หน้าที่",
        width: "150px",
        readonly: false,
        maxlength: 16,
        type: "text"
    },
    {
        field: "created",
        header: "เริ่มงาน",
        width: "100px",
        readonly: false,
        maxlength: 0,
        type: "date"
    },
    {
        field: "stoped",
        header: "ลาออก",
        width: "100px",
        readonly: false,
        maxlength: 0,
        type: "date"
    },
    {
        field: "passwdTime",
        header: "วันที่รหัสผ่าน",
        width: "180px",
        readonly: true,
        maxlength: 0
    }
]

const colMap: any = {}
columns.forEach((item) => (colMap[item.field] = item))

// proper way to fetch data after render UI + autofocus
// onActivated(() => nextTick()).then(refresh))
onActivated(refresh)

var level = -1
var mode: Mode = Mode.Close
var selectedIdx = 0

function refresh() {
    level = Client.getSession().permission["User"]
    Client.service.post("userQuery").then((res) => {
        mode = Mode.Open
        userList.value = res.data
        user.value = userList.value[0]
    })
}

function save(event: any) {
    confirm.require({
        target: event.currentTarget,
        message: "ยืนยันการบันทึกข้อมูลผู้ใช้หรือไม่ ?",
        icon: "pi pi-question",
        defaultFocus: "reject",
        accept: () => {
            Client.service.post("userUpdate", user.value).then(refresh)
        }
    })
}

function onSelect(e: any) {
    mode = Mode.Open
    selectedIdx = e.index
    console.log("Selected Index", selectedIdx)
}

function newUser() {
    mode = Mode.Insert
    user.value = new KxUser()
    // userList.value.splice(curIdx, 0, user.value)
}

function remove(event: any) {
    if (user.value.user === Client.getSession().user) return
    confirm.require({
        target: event.currentTarget,
        message: "ยืนยันการลบผู้ใช้หรือไม่ ?",
        icon: "pi pi-prime",
        defaultFocus: "reject",
        accept: () => {
            Client.service.post("userDelete", { user: user.value.user }).then(refresh)
        }
    })
}

function chgPwd() {}

function chgPwd2() {}

function exportCSV() {
    dt.value.exportCSV()
}
</script>

<template>
    <div class="p-toolbar">
        <Button
            class="tool-button"
            icon="pi pi-external-link"
            label="Export"
            @click="exportCSV"
            title="ส่งออกไฟล์ข้อมูล"
            :disabled="level <= 0 || mode !== Mode.Open"
        />
        <Button
            class="tool-button"
            icon="pi pi-save"
            label="บันทึก"
            @click="save"
            title="บันทึกการแก้ไข"
            :disabled="level <= 0 || mode === Mode.Open"
        />
        <Button
            class="tool-button"
            icon="pi pi-user-plus"
            label="สร้าง"
            @click="newUser"
            title="สร้างผู้ใช้ใหม่"
            :disabled="level <= 7 || mode !== Mode.Open"
        />
        <Button
            class="tool-button"
            icon="pi pi-ban"
            label="ลบผู้ใช้"
            @click="remove"
            title="ลบผู้ใช้"
            :disabled="level <= 7 || mode !== Mode.Open"
        />
        <Button
            class="tool-button"
            icon="pi pi-key"
            label="รหัสผ่าน"
            @click="chgPwd"
            title="เปลี่ยนรหัสผ่าน"
            :disabled="level <= 0 || mode !== Mode.Open"
        />
        <Button
            class="tool-button"
            icon="pi pi-lock-open"
            label="รหัสผ่าน 2"
            @click="chgPwd2"
            title="เปลี่ยนรหัสผ่านซุปเปอร์ไวเซอร์"
            :disabled="level <= 4 || mode !== Mode.Open"
        />
    </div>
    <div class="p-card flex flex-column flex-wrap" style="height: 280px">
        <div class="field">
            <small>{{ colMap["user"].header }}</small>
            <br />
            <InputText
                v-model="user.user"
                type="text"
                :style="{ width: colMap['user'].width }"
                :maxlength="colMap['user'].maxlength"
                :readonly="(colMap['user'].readonly && mode !== Mode.Insert) || level <= 0"
                required
                autofocus
            />
        </div>
        <div class="field">
            <small>{{ colMap["name"].header }}</small>
            <br />
            <InputText
                v-model="user.name"
                type="text"
                :style="{ width: colMap['name'].width }"
                :maxlength="colMap['name'].maxlength"
                :readonly="colMap['name'].readonly || level <= 5"
                required
            />
        </div>
        <div class="field">
            <small>{{ colMap["descript"].header }}</small>
            <br />
            <InputText
                v-model="user.descript"
                type="text"
                :style="{ width: colMap['descript'].width }"
                :maxlength="colMap['descript'].maxlength"
                :readonly="colMap['descript'].readonly || level <= 5"
            />
        </div>
        <div class="field">
            <small>{{ colMap["level"].header }}</small>
            <br />
            <Dropdown
                v-model="user.level"
                :options="Client.LEVELS"
                optionLabel="label"
                optionValue="value"
                data-key="value"
                :style="{ width: colMap['level'].width }"
                :readonly="colMap['level'].readonly || level < 7"
            />
        </div>
        <div class="field">
            <small>{{ colMap["role"].header }}</small>
            <br />
            <span class="p-input-icon-right">
                <InputText
                    v-model="user.role"
                    type="text"
                    :style="{ width: colMap['role'].width }"
                    :maxlength="colMap['role'].maxlength"
                    :readonly="colMap['role'].readonly || level < 7"
                />
                <i class="pi pi-search" />
            </span>
        </div>
        <div class="field">
            <small>{{ colMap["created"].header }}</small>
            <br />
            <Calendar
                v-model="user.created"
                :date-format="Client.dateInputFormat"
                :readonly="colMap['created'].readonly || level <= 0"
            />
        </div>
        <div class="field">
            <small>{{ colMap["passwdTime"].header }}</small>
            <br />
            <InputText
                v-model="user.passwdTime"
                type="text"
                :style="{ width: colMap['passwdTime'].width }"
                :readonly="colMap['passwdTime'].readonly || level <= 0"
            />
        </div>
        <div class="field">
            <small>{{ colMap["stoped"].header }}</small>
            <br />
            <Calendar
                v-model="user.stoped"
                :date-format="Client.dateInputFormat"
                :readonly="colMap['stoped'].readonly || level <= 7"
            />
        </div>
    </div>
    <DataTable
        ref="dt"
        scrollable
        scroll-height="300px"
        selection-mode="single"
        show-gridlines
        striped-rows
        :value="userList"
        dataKey="user"
        v-model:selection="user"
        v-on:row-select="onSelect"
    >
        <Column
            header="ที่"
            class="m-0 p-1 text-right"
            header-style="text-decoration: underline"
            style="min-width: 30px"
        >
            <template #body="slotProps">
                {{ slotProps.index + 1 }}
            </template>
        </Column>
        <Column
            v-for="col of columns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            header-style="text-decoration: underline"
            :style="{
                margin: '0px',
                padding: '2px',
                overflow: 'hidden',
                'padding-left': '5px',
                'padding-right': '5px',
                'min-width': col.width,
                'max-width': col.width,
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis',
                'text-align':
                    col.type == 'number' ? 'right' : col.type == 'code' ? 'center' : 'left'
            }"
        />
        <template #footer>{{ userList.length }} records </template>
    </DataTable>
</template>
