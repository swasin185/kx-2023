import { Application } from "express"
import mysql, { Pool } from "mysql2/promise"
import { networkInterfaces } from "os"
import ShareLib from "./shared/ShareLib.js"
import getClientIp from "get-client-ip"
import Session from "./shared/Session.js"

export default class Library {
    public static readonly apiURL = "/api/"
    public static readonly servLogin = Library.apiURL + 'login'
    public static readonly servSession = Library.apiURL + 'getSession'
    private static servCount = 0;
    static {
        // JSON date & datetime format
        Date.prototype.toJSON = function () {
            if (this.getHours() == 0)
                return this.toLocaleDateString()
            else
                return this.toLocaleDateString() + "[" + this.toLocaleTimeString() + "]"
        }
    }

    public static getServerIP(): any {
        return Object.values(networkInterfaces())
            .flat()
            .find((i) => i?.family == "IPv4" && !i?.internal)?.address
    }

    public static post(app: Application, service: any): void {
        console.info("POST:", service.name)
        app.post(Library.apiURL + service.name, async (request: any, response: any) => {
            Library.servCount++;
            const time = new Date()

            const conn: Session = request.session?.connect
            if (conn?.level > -1 ||
                request.path == Library.servLogin ||
                request.path == Library.servSession)
                response.json(await service(request))
            else
                response.status(401).send("Session Unauthorized")


            Library.log(service.name, time, request, response)
        })
    }

    private static log(servName: string, time: Date, request: any, response: any) {
        const size = response.getHeader('Content-Length') / 1000
        const elapse = (Date.now() - time.getTime()) / 1000
        console.log(Library.servCount.toString().padStart(5, ' '),
            time.toLocaleTimeString(),
            servName.padEnd(20, ' '),
            getClientIp(request)?.replace("::ffff:", "").padEnd(15, ' '),
            size.toFixed(3).padStart(10, ' '), "kB",
            elapse.toFixed(3).padStart(10, ' '), "sec")
    }

    private static readonly config = {
        host: ShareLib.HOST,
        user: "kxserv",
        password: "kxserv",
        database: "kxtest",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    }

    private static dbPool: Pool

    private static readonly DBPORTS = [
        {
            db: "kxtest",
            port: 8000,
            color: "#103090",
            comCode: "1",
            comName: "บริษัท KX2023 ทดสอบ จำกัด",
        },
        {
            db: "kxpay",
            port: 8001,
            color: "#EECC00",
            comCode: "1",
            comName: "KH Salary System",
        },
    ]

    public static service = Library.DBPORTS[0]

    public static getDbPool(): Pool {
        return Library.dbPool
    }

    public static setDB(db: string) {
        for (let item of Library.DBPORTS)
            if (item.db == db) {
                Library.service = item
                break
            }
        if (Library.service.db)
            Library.config.database = Library.service.db
        if (Library.dbPool) Library.dbPool.end()
        Library.dbPool = mysql.createPool(Library.config)
        Library.dbPool.execute("select * from kxuser where user=?", ["admin"]).then(([[results]]: any) => {
            console.assert(results.user == "admin", "setDB Error!")
        })
    }
}
