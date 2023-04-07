import Company from "../shared/Company.js"
import Library from "../Library.js"

export default class ExtendImpl {
    static async queryAllCompany(req: any) {
        const [result]: any = await Library.getDbPool().execute("select * from company")
        return <Company[]>result
    }
}
