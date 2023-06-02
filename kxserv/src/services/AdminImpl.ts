import Library from "../Library.js"
import BaseImpl from "./BaseImpl.js"

export default class AdminImpl {
    static async userQuery(req: any) {
        const conn = BaseImpl.session(req)
        const result =
            await Library.getDbPool().execute("select * from kxuser where ?>=7 or user=?",
                [conn.level, conn.user])
        return result
    }

    static async userSelect(req: any) {
        const user = req.body.user
        const [result] =
            await Library.getDbPool().execute("select * from kxuser where user=?", [user])
        return result
    }

    static async userInsert(req: any) { }

    static async userUpdate(req: any) {
        const pr = req.body
        let result =
            await Library.getDbPool().execute(
                `
                update kxuser
                set name=?,descript=?,level=?,role=?,created=?,stoped=?
                where user=?`,
                [pr.name, pr.descript, pr.level, pr.role, pr.created, pr.stoped, pr.user])
        if (result.affectedRows == 0) {
            result = await Library.getDbPool().execute(
                `
                insert into kxuser(user,name,descript,level,role,created,stoped)
                value (?,?,?,?,?,?,?)`,
                [pr.user, pr.name, pr.descript, pr.level, pr.role,
                pr.created ? new Date(pr.created) : null,
                pr.stoped ? new Date(pr.stoped) : null])
        }
        return result.affectedRows
    }

    static async userDelete(req: any) {
        const user = req.body.user
        const result =
            await Library.getDbPool().execute("delete from kxuser where user=?", [user])
        return result.affectedRows
    }

}
