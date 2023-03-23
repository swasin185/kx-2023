import { Application } from "express"
import Session from "../shared/Session.js"
import KxUser from "../shared/KxUser.js"
import Company from "../shared/Company.js"
import Library from "../Library.js"
// import ShareLib from "../shared/ShareLib.js"

export default class Login {
    public static serve(app: Application) {
        Library.post(app, Login.login)
        Library.post(app, Login.verifyLevel)
        Library.post(app, Login.logout)
        Library.post(app, Login.getSession)
        Library.post(app, Login.queryUser)
        Library.post(app, Login.queryAllUser)
        Library.post(app, Login.queryTest)
    }

    private static getSession(req: any): Session {
        let conn: Session = req.session.connect
        let program = req.body.program
        if (!conn) {
            conn = new Session()
            Login.reset(conn)
            req.session.connect = conn
        }
        conn.counter++
        conn.serverTime = Date.now()
        // if (conn.loginTime && program) {
        //     Library.getDbPool().execute("update kxpermission set used=used+1 where user=? and program=?", [
        //         conn.user,
        //         program,
        //     ])
        // }
        return conn
    }

    private static async login(req: any) {
        if (!req.body) req.body = req.query // for get query URL
        const conn = Login.getSession(req)
        Login.reset(conn)
        let user = req.body.user
        let password = req.body.password
        conn.user = user
        if (user) {
            let result = await Login.queryUser(req)
            if (result && (result.passwd == null || result.passwd == password)) {
                conn.user = result.user
                conn.level = result.level
                conn.loginTime = Date.now()
                conn.name = result.name
                let com = await Login.queryCompany(req);
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

    private static async verifyLevel(req: any) {
        await Login.queryTest(req)
        if (!req.body) req.body = req.query // for get query URL
        let level = -1
        let user = req.body.user
        let password = req.body.password
        let program = req.body.program
        if (user) {
            let result = await Login.queryUser(req)
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

    private static logout(req: any): Session {
        const conn = Login.getSession(req)
        Login.reset(conn)
        return conn
    }

    public static async queryUser(req: any) {
        let user = req.body.user
        let userRec: KxUser | null = null
        if (user) {
            const [[result]]: any = await Library.getDbPool().execute("select * from kxuser where user=?", [user])
            if (result) userRec = <KxUser>result
        }
        return userRec
    }

    public static async queryCompany(req: any) {
        const conn = Login.getSession(req)
        let comCode = conn.comCode
        let comRec: Company | null = null
        if (comCode) {
            const [[result]]: any = await Library.getDbPool().execute("select * from company where comCode=?", [comCode])
            if (result) comRec = <Company>result
        }
        return comRec
    }

    public static async queryTest(req: any) {
        let delay = req.body.delay
        if (!delay) delay = 2
        const [[result]]: any = await Library.getDbPool().execute("select sleep(?)", [delay])
        return result
    }

    public static async queryAllUser(req: any) {
        let user = req.body.user
        let level = req.body.level
        let list: KxUser[] = []
        // console.log(user, level, req.body)
        if (user) {
            const [result]: any = await Library.getDbPool().execute("select * from kxuser where user=? or level<?", [
                user,
                level,
            ])
            if (result) list = <KxUser[]>result
        }
        return list;
    }

    private static reset(conn: Session): void {
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
        conn.permissions = []
    }
}
