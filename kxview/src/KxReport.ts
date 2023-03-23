import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from "axios"
import ShareLib from "../../kxserv/src/shared/ShareLib"
import Client from "./Client"

// interface ReportParameter {
//     app?: string
//     db?: string
//     report?: string
//     comCode?: string
//     comName?: string
//     fromDate?: string
//     toDate?: string
//     fromId?: string
//     toId?: string
//     idList?: string
//     option?: string
// }

class KxReport {
    private static readonly WIN_OPT = "width=800,height=800,toolbar=no,menubar=no,location=no"
    private static readonly BASE_URL = "https://" + ShareLib.HOST + ":8443/kxreport"
    private service: AxiosInstance

    constructor() {
        console.log("create KxReport " + KxReport.BASE_URL)
        this.service = axios.create({
            withCredentials: false,
            baseURL: KxReport.BASE_URL,

            headers: {
                "Authorization": "Basic",
                "Cache-Control": "no-cache"
            },
            responseType: "arraybuffer" // ** window.open pdf as blob
        })
        this.service.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                Client.waitting.value = true
                return config
            }
        )
        this.service.interceptors.response.use(
            (res: AxiosResponse) => {
                Client.waitting.value = false
                return res
            },
            () => Client.waitting.value = false // close waiting when error
        )
    }

    public jsonToURI(jsonObj: Record<string, string>): string {
        const params: string[] = []
        const connection = Client.getSession()
        if (connection) {
            if (!jsonObj.app) jsonObj.app = ""
            if (!jsonObj.comCode) jsonObj.comCode = connection.comCode || ""
            if (!jsonObj.comName) jsonObj.comName = connection.comName || ""
            if (!jsonObj.db) jsonObj.db = connection.db || ""
            Object.keys(jsonObj).forEach((key) => params.push(`${key}=${jsonObj[key]}`))
        }
        return params.join("&")
    }

    private async callReport(params: string): Promise<string> {
        const res: AxiosResponse = await this.service.post("/openPDF", params)
        if (res) {
            const blob = new Blob([res.data], { type: "application/pdf" })
            return URL.createObjectURL(blob)
        } else
            return KxReport.BASE_URL
    }

    // เรียกรายงาน แบบ pdf ผ่าน url query parameters
    public open(params: string): void {
        this.callReport(params).then((response) => {
            if (response)
                window.open(
                    response,
                    "report",
                    KxReport.WIN_OPT
                )
        })
    }

    // เรียกรายงาน แบบ pdf เซฟไม่ได้ ผ่าน url query parameters
    // public view(params: string): void {
    //     const win = window.open(
    //         undefined,
    //         "report",
    //         KxReport.WIN_OPT
    //     )
    //     this.callReport(params).then((response) => {
    //         if (response) {
    //             const iframe =
    //                 `<html><head><title>Report Viewer</title></head><body><iframe src=${response} style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe></body></html>`
    //             win?.document.write(iframe)
    //         } else {
    //             win?.location.replace(response)
    //         }
    //     })
    // }

    // เรียกรายงาน แบบ pdf ผ่าน json parameter
    public openJS(params: Record<string, string>): void {
        const p = this.jsonToURI(params)
        this.open(p)
    }

    // เรียกรายงาน แบบ pdf เซฟไม่ได้ ผ่าน json parameter
    // public viewJS(params: Record<string, string>): void {
    //     const p = this.jsonToURI(params)
    //     this.view(p)
    // }
}

export default new KxReport()
