<script lang="ts">
export default {
    name: "User"
}
</script>

<script lang="ts" setup>
import { ref, onActivated, nextTick } from "vue"
import Client from "../Client"
import KxUser from "../../../kxserv/src/shared/KxUser"
import InputText from "primevue/inputtext"
import DataTable from "primevue/datatable"
import Calendar from "primevue/calendar"
import Column from "primevue/column"
import Dropdown from "primevue/dropdown"
import Button from "primevue/button"

const dt = ref<any>(null)
const user = ref(new KxUser())
const userList = ref([])
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
        type: "text"
    },
    {
        field: "passwdTime",
        header: "วันที่รหัสผ่าน",
        width: "200px",
        readonly: true,
        maxlength: 0
    }
]

const colMap: any = {}
columns.map((item) => (colMap[item.field] = item))

// proper way to fetch data after render UI + autofocus
onActivated(() => nextTick().then(refresh))

function refresh() {
    Client.service.post("userQuery").then((res) => {
        userList.value = res.data
        user.value = userList.value[0]
    })
}

function exportCSV() {
    dt.value.exportCSV()
}
</script>

<template>
    <div class="p-toolbar">
        <Button class="tool-button" icon="pi pi-sync" label="Refresh" @click="refresh" />
        <Button class="tool-button" icon="pi pi-external-link" label="Export" @click="exportCSV" />
    </div>
    <div class="p-card flex flex-column flex-wrap" style="height: 200px">
        <div class="field">
            <small>{{ colMap["user"].header }}</small
            ><br />
            <InputText
                v-model="user.user"
                type="text"
                :style="{ width: colMap['user'].width }"
                :maxlength="colMap['user'].maxlength"
                :readonly="colMap['user'].readonly"
                required
                autofocus
            />
        </div>
        <div class="field">
            <small>{{ colMap["name"].header }}</small
            ><br />
            <InputText
                v-model="user.name"
                type="text"
                :style="{ width: colMap['name'].width }"
                :maxlength="colMap['name'].maxlength"
                :readonly="colMap['name'].readonly"
                required
            />
        </div>
        <div class="field">
            <small>{{ colMap["descript"].header }}</small
            ><br />
            <InputText
                v-model="user.descript"
                type="text"
                :style="{ width: colMap['descript'].width }"
                :maxlength="colMap['descript'].maxlength"
                :readonly="colMap['descript'].readonly"
            />
        </div>
        <div class="field">
            <small>{{ colMap["level"].header }}</small
            ><br />
            <Dropdown
                v-model="user.level"
                :options="Client.LEVELS"
                optionLabel="label"
                optionValue="value"
                data-key="value"
                :style="{ width: colMap['level'].width }"
                :readonly="colMap['level'].readonly"
            />
        </div>
        <div class="field">
            <small>{{ colMap["role"].header }}</small
            ><br />
            <span class="p-input-icon-right">
                <InputText
                    v-model="user.role"
                    type="text"
                    :style="{ width: colMap['role'].width }"
                    :maxlength="colMap['role'].maxlength"
                    :readonly="colMap['role'].readonly"
                />
                <i class="pi pi-search" />
            </span>
        </div>
        <div class="field">
            <small>{{ colMap["created"].header }}</small
            ><br />
            <Calendar
                v-model="user.created"
                date-format="dd/mm/yy"
                :readonly="colMap['created'].readonly"
            />
        </div>
        <div class="field">
            <small>{{ colMap["passwdTime"].header }}</small
            ><br />
            <InputText
                v-model="user.passwdTime"
                type="text"
                :style="{ width: colMap['passwdTime'].width }"
                :readonly="colMap['passwdTime'].readonly"
            />
        </div>
    </div>
    <DataTable
        ref="dt"
        scrollable
        scroll-height="400px"
        show-gridlines
        striped-rows
        :value="userList"
        dataKey="user"
        v-model:selection="user"
        selection-mode="single"
    >
        <Column header="#" class="m-0 p-1 text-right">
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
                'padding-left': '5px',
                'padding-right': '5px',
                'min-width': col.width,
                'max-width': col.width,
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis',
                overflow: 'hidden',
                'text-align':
                    col.type == 'number' ? 'right' : col.type == 'code' ? 'center' : 'left'
            }"
        />
        <template #footer>{{ userList.length }} records </template>
    </DataTable>
</template>
