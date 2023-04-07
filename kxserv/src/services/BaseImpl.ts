import Session from "../shared/Session.js"
import KxUser from "../shared/KxUser.js"
import Company from "../shared/Company.js"
import Library from "../Library.js"

export default class BaseImpl {
    static getSession(req: any): Session {
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
            Library.getDbPool().execute("update kxpermission set used=used+1 where user=? and program=?", [
                conn.user,
                program,
            ])
        }
        return conn
    }

    static async login(req: any) {
        const conn = BaseImpl.getSession(req)
        Library.reset(conn)
        const user = req.body.user
        const password = req.body.password
        conn.user = user
        if (user) {
            let result = await BaseImpl.queryUser(req)
            if (result && (result.passwd == null || result.passwd == password)) {
                conn.user = result.user
                conn.level = result.level
                conn.loginTime = Date.now()
                conn.name = result.name
                let com = await BaseImpl.queryCompany(req);
                if (com)
                    conn.comName = com.comName
                let [permissions]: any = await Library.getDbPool().execute(
                    "select program, level from kxpermission where user=?",
                    [user]
                )
                conn.permissions = permissions
            }
        }
        return conn
    }

    static async verifyLevel(req: any) {
        await BaseImpl.queryTest(req)
        let level = -1
        const user = req.body.user
        const password = req.body.password
        const program = req.body.program
        if (user) {
            let result = await BaseImpl.queryUser(req)
            if (result && (result.passwd2 == null || result.passwd2 == password)) {
                if (result.level <= 6) {
                    let [[permission]]: any = await Library.getDbPool().execute(
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
        const conn = BaseImpl.getSession(req)
        Library.reset(conn)
        return conn
    }

    static async queryUser(req: any) {
        const user = req.body.user
        const [[result]]: any = await Library.getDbPool().execute("select * from kxuser where user=?", [user])
        return <KxUser>result
    }

    static async queryCompany(req: any) {
        const conn = BaseImpl.getSession(req)
        const comCode = conn.comCode
        let comRec: Company | null = null
        if (comCode) {
            const [[result]]: any = await Library.getDbPool().execute("select * from company where comCode=?", [comCode])
            if (result) comRec = <Company>result
        }
        return comRec
    }

    static async queryTest(req: any) {
        const delay = req.body.delay | 3 // seconds
        const [[result]]: any = await Library.getDbPool().execute("select sleep(?)", [delay])
        return result
    }

    static async queryAllUser(req: any) {
        const conn = BaseImpl.getSession(req)
        const [result]: any = await Library.getDbPool().execute("select * from kxuser where user=? or level<?",
            [conn.user, conn.level])
        return <KxUser[]>result
    }
}
