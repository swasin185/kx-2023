import Library from "../Library.js"
import Company from "../shared/Company.js"
import KxUser from "../shared/KxUser.js"

export default class AdminImpl {

    static async companyQuery(req: any) {
        const [result]: any = await Library.getDbPool().execute("select * from company")
        return <Company[]>result
    }

    static async userQuery(req: any) {
        const [result]: any = await Library.getDbPool().execute("select * from kxuser")
        return <KxUser[]>result
    }

    static async userSelect(req: any) {
        const user = req.body.user
        const [[result]]: any = await Library.getDbPool().execute("select * from kxuser where user=?", [user])
        return <KxUser>result
    }

    static async userInsert(req: any) { }

    static async userUpdate(req: any) { }

    static async userDelete(req: any) { }

}
