import { networkInterfaces } from "os"
import mysql, { Pool } from "mariadb"
import ShareLib from "./shared/ShareLib.js"
import Session from "./shared/Session.js"

export default class Library {
    static {
        // JSON date & datetime format use inline if for performance
        Date.prototype.toJSON = function () {
            return (this.getHours() == 0 ? this.toLocaleDateString() : this.toLocaleString())
        }
    }

    public static getServerIP(): any {
        return Object.values(networkInterfaces())
            .flat()
            .find((i) => i?.family == "IPv4" && !i?.internal)?.address
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
            db: "payroll",
            port: 8001,
            color: "#EECC00",
            comCode: "01",
            comName: "KH Payroll System",
        },
    ]

    public static service = Library.DBPORTS[0]

    public static reset(conn: Session): void {
        conn.counter = 0
        conn.serverTime = Date.now()
        conn.db = Library.service.db
        conn.comCode = Library.service.comCode
        conn.comName = Library.service.comName
        conn.color = Library.service.color
        conn.loginTime = undefined
        conn.user = undefined
        conn.name = undefined
        conn.level = -1
        conn.permission = {}
    }

    public static getDbPool(): Pool {
        return Library.dbPool
    }

    public static setDB(db: string) {
        for (let item of Library.DBPORTS)
            if (item.db == db) {
                Library.service = item
                break
            }
        // if (Library.dbPool) Library.dbPool.end()
        Library.config.database = Library.service.db
        Library.dbPool = mysql.createPool(Library.config)
        Library.dbPool.query("select * from kxuser where user=?", ["admin"]).
            then(([res]) => console.assert(res.user == "admin", "setDB Error!"))
    }
}
