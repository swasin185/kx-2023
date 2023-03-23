import Permission from "./Permission"

export default class Session {
    counter: number = 0
    serverTime?: number
    db?: string
    color?: string
    comCode?: string
    comName?: string
    loginTime?: number
    user?: string
    name?: string
    level: number = -1
    permissions: Permission[] = []
}
