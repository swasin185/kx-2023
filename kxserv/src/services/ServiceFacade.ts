import ExtendImpl from "./ExtendImpl.js"
import BaseImpl from "./BaseImpl.js"

export default class ServiceFacade {
    static getSession = BaseImpl.getSession
    static login = BaseImpl.login
    static verifyLevel = BaseImpl.verifyLevel
    static logout = BaseImpl.logout
    static queryUser = BaseImpl.queryUser
    static queryCompany = BaseImpl.queryCompany
    static queryTest = BaseImpl.queryTest
    static queryAllUser = BaseImpl.queryAllUser
    static queryAllCompany = ExtendImpl.queryAllCompany
}
