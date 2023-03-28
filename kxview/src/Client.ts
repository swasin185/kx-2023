import Session from "../../kxserv/src/shared/Session"
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from "axios"
import { ref } from "vue"
import ShareLib from "../../kxserv/src/shared/ShareLib"

export default class Client {
    public static readonly service: AxiosInstance =
        axios.create({
            baseURL: "/api/",
            method: "post",
            timeout: 60_000, // 60 seconds
            withCredentials: true,
            responseType: "json"
        })

    public static readonly MENU_ITEMS = ref([
        {
            label: "1 Setting", icon: "pi pi pi-cog", disabled: false,
            items: [
                { program: "User", label: "1.1 ผู้ใช้", icon: "pi pi-user-edit", command: Client.command, visible: false },
                { program: "Permission", label: "1.2 สิทธิการใช้งาน", icon: "pi pi-lock-open", command: Client.command, visible: false },
                // { separator: true, visible: false, default: false },
                { program: "Company", label: "1.3 บริษัท", icon: "pi pi-home", command: Client.command, visible: false },
                { program: "Employee", label: "1.4 พนักงาน", icon: "pi pi-users", command: Client.command, visible: false },
                { program: "Payment", label: "1.5 การจ่ายเงิน", icon: "pi pi-wallet", command: Client.command, visible: false },
                { program: "Holiday", label: "1.6 วันหยุด", icon: "pi pi-calendar-times", command: Client.command, visible: false }
            ]
        },
        {
            label: "2 ทดสอบ", icon: "pi pi-sitemap", disabled: false,
            items: [
                { program: "Monty", label: "2.1 เกมส์เปิดเหรียญ", icon: "pi pi-dollar", command: Client.command, visible: false, default: false },
                { program: "TheMaze", label: "2.2 เขาวงกต", icon: "pi pi-qrcode", command: Client.command, visible: false, default: false },
                { program: "Mandelbrot", label: "2.3 แมนเดลบรอต", icon: "pi pi-heart-fill", command: Client.command, visible: false, default: false },
                { separator: true, visible: false, default: false },
                { program: "TestPanel", label: "2.4 ทดสอบ Panel", icon: "pi pi-desktop", command: Client.command, visible: false },
                { program: "TestReport", label: "2.5 ทดสอบ Report", icon: "pi pi-print", command: Client.command, visible: false },
            ]
        },
        {
            label: "3 เพิ่มเติม...", icon: "pi pi-share-alt", disabled: false,
            items: [
                { program: "Menu01", label: "3.1 เมนู 1", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu02", label: "3.2 เมนู 2", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu03", label: "3.3 เมนู 3", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu04", label: "3.4 เมนู 4", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu05", label: "3.5 เมนู 5", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu06", label: "3.6 เมนู 6", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu07", label: "3.7 เมนู 7", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu08", label: "3.8 เมนู 8", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu09", label: "3.9 เมนู 9", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu10", label: "3.10 เมนู 10", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
            ]
        },
        {
            label: "4 เพิ่มเติม...", icon: "pi pi-share-alt", disabled: false,
            items: [
                { program: "Menu01", label: "เมนู 1", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu02", label: "เมนู 2", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu03", label: "เมนู 3", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu04", label: "เมนู 4", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu05", label: "เมนู 5", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu06", label: "เมนู 6", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu07", label: "เมนู 7", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu08", label: "เมนู 8", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu09", label: "เมนู 9", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu10", label: "เมนู 10", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
            ]
        },
        {
            label: "5 เพิ่มเติม...", icon: "pi pi-share-alt", disabled: false,
            items: [
                { program: "Menu01", label: "เมนู 1", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu02", label: "เมนู 2", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu03", label: "เมนู 3", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu04", label: "เมนู 4", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu05", label: "เมนู 5", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu06", label: "เมนู 6", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu07", label: "เมนู 7", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu08", label: "เมนู 8", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu09", label: "เมนู 9", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu10", label: "เมนู 10", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu11", label: "เมนู 11", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu12", label: "เมนู 12", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu13", label: "เมนู 13", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu14", label: "เมนู 14", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu15", label: "เมนู 15", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu16", label: "เมนู 16", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu17", label: "เมนู 17", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu18", label: "เมนู 18", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
                { program: "Menu19", label: "เมนู 19", icon: "pi pi-images", command: Client.command, visible: false, default: false },
                { program: "Menu20", label: "เมนู 20", icon: "pi pi-chart-line", command: Client.command, visible: false, default: false },
            ]
        },
    ])

    private static readonly history: string[] = []

    public static readonly current = ref({
        pgmName: "",
        program: "",
        level: -1,
        supervisor: "",
        superlevel: -1
    })

    public static readonly status = ref<string>()
    public static readonly connection = ref<Session>(new Session())
    public static readonly waitting = ref<boolean>(false)
    public static readonly drawerOpen = ref<boolean>(false)

    // public static notify(text: string): void {
    //     Notify.create(text)
    // }

    // public static alert(text: string): void {
    //     Dialog.create({
    //         dark: true,
    //         title: "Alert",
    //         message: text,
    //     })
    // }

    public static readonly LEVELS = [
        { value: 0, label: "[0] Viewer" },
        { value: 1, label: "[1] Data Entry" },
        { value: 2, label: "[2] Officer" },
        { value: 3, label: "[3] Senior Officer" },
        { value: 4, label: "[4] Supervisor" },
        { value: 5, label: "[5] Manager" },
        { value: 6, label: "[6] Executive" },
        { value: 7, label: "[7] Administrator" },
        { value: 8, label: "[8] Developer" },
        { value: 9, label: "[9] Creator" }
    ]

    public static setupSession(conn: Session): void {
        Client.connection.value = conn
        if (conn.comName)
            document.title = conn.comName
        Client.MENU_ITEMS.value.forEach(group => {
            let itemCount = 0
            group.items.forEach(item => {
                item.visible = item.default || Client.checkPermission(item.program) > -1
                if (item.visible)
                    itemCount++
            })
            group.disabled = itemCount == 0
        })
    }

    private static checkPermission(program?: string): number {
        if (Client.connection.value.level > -1) {
            const perm = Client.connection.value.permissions
            if (Client.connection.value.level >= 7)
                return Client.connection.value.level
            else
                for (let i = 0; i < perm.length; i++)
                    if (program == perm[i].program)
                        return perm[i].level
        }
        return -1
    }

    public static getSession(): Session {
        return Client.connection.value
    }

    public static async checkSession(program: string) {
        await Client.service
            .post("getSession", program)
            .then((res) => Client.setupSession(res.data))
    }

    private static setCurrent(program: string): void {
        const current = Client.current.value
        current.program = program
        Client.status.value = program
        current.level = Client.checkPermission(program)
        current.supervisor = ""
        current.superlevel = -1;
        current.pgmName = ""
        Client.MENU_ITEMS.value.forEach(group => {
            group.items.forEach(item => {
                if (program == item.program) {
                    current.pgmName = item.label
                    return
                }
            })
        })
    }

    public static setPanel(program: string) {
        Client.drawerOpen.value = false
        if (Client.getPanel() > "" && (Client.history.length == 0 ||
            program !== Client.history[Client.history.length - 1]))
            Client.history.push(Client.getPanel())
        Client.setCurrent(program)
    }

    public static getPanel(): string {
        return Client.current.value.program
    }

    public static backPanel(): void {
        if (Client.history.length == 0)
            // recheck session when open menu
            Client.checkSession(Client.current.value.program)
                .then(() => Client.drawerOpen.value = true)
        else {
            Client.setCurrent(Client.history.pop() || "Login")
        }
    }

    public static nextFocus(e: KeyboardEvent) {
        const curTarget = e.target as HTMLInputElement
        if (curTarget) {
            const elems = document.getElementsByTagName("input")
            const idx = (curTarget.tabIndex % elems.length) + 1
            for (let i = 0; i < elems.length; i++) {
                const el = elems.item(i)
                if (el?.tabIndex == idx) {
                    el.focus()
                    el.select()
                    return
                }
            }
        }
    }

    public static command(event: any): void {
        Client.setPanel(event.item.program)
    }

    static {
        Date.prototype.toString = function () {
            if (this.getHours() == 0) // only check hour for performance
                return this.toLocaleDateString(ShareLib.locale)
            else
                return this.toLocaleString(ShareLib.locale)
        }
        Client.service.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                Client.waitting.value = true
                return config
            }
        )
        Client.service.interceptors.response.use(
            (res: AxiosResponse) => {
                Client.waitting.value = false
                return res
            },
            (error) => {
                console.log(error.response?.status, error.message)
                if (error.response?.status == 401)
                    window.location.reload()
                return error;
            }
        )
    }

}
