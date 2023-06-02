import Session from "../shared/Session.js"
import Permission from "../shared/Permission.js"
import Company from "../shared/Company.js"
import Library from "../Library.js"
import AdminImpl from "./AdminImpl.js"

export default class BaseImpl {
    static session(req: any): Session {
        let conn: Session = req.session.connect
        const program = req.body.program
        if (!conn) {
            conn = new Session()
            Library.reset(conn)
            req.session.connect = conn
        }
        conn.counter++
        conn.serverTime = Date.now()
        if (conn.loginTime && program) {
            Library.getDbPool().execute("update kxpermission set used=used+1 where user=? and program=?",
                [conn.user, program])
        }
        return conn
    }

    static async login(req: any) {
        const conn = BaseImpl.session(req)
        Library.reset(conn)
        const user = req.body.user
        const password = req.body.password
        conn.user = user
        if (user) {
            const result = await AdminImpl.userSelect(req)
            if (result && (result.passwd == null || result.passwd == password)) {
                conn.user = result.user
                conn.level = result.level
                conn.loginTime = Date.now()
                conn.name = result.name
                const com = await BaseImpl.companySelect(req);
                if (com)
                    conn.comName = com.comName
                const permissions = await Library.getDbPool().execute(
                    "select program, level from kxpermission where user=?", [user])
                permissions.forEach((element: Permission) => conn.permission[element.program] = element.level)
            }
        }
        return <Session>conn
    }

    static async verifyLevel(req: any) {
        await BaseImpl.testQuery(req)
        let level: number = -1
        const user = req.body.user
        const password = req.body.password
        const program = req.body.program
        if (user) {
            const result = await AdminImpl.userSelect(req)
            if (result && (result.passwd2 == null || result.passwd2 == password)) {
                if (result.level <= 6) {
                    const [permission] = await Library.getDbPool().execute(
                        "select level from kxpermission where user=? and program=?",
                        [user, program]
                    )
                    if (permission) level = permission.level
                } else level = result.level
            }
        }
        return level
    }

    static logout(req: any): Session {
        const conn = BaseImpl.session(req)
        Library.reset(conn)
        return <Session>conn
    }

    static async companyQuery(req: any) {
        const result = await Library.getDbPool().execute("select * from company")
        return result
    }

    static async companySelect(req: any) {
        const conn = BaseImpl.session(req)
        const [result] =
            await Library.getDbPool().execute("select * from company where comCode=?", [conn.comCode])
        return <Company>result
    }

    static async testQuery(req: any) {
        const delay = req.body.delay | 3 // seconds
        const [result]: any =
            await Library.getDbPool().execute("select sleep(?)", [delay])
        return result
    }

    static async serverMemory(req: any) {
        const memoryUsage = process.memoryUsage()
        return memoryUsage
    }
}
