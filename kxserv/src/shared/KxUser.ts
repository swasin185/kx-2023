import { Nullable } from './ShareLib.js';
export default class KxUser {
    user?: string
    name: Nullable<string> = null
    descript: Nullable<string> = null
    level: number = -1
    role: Nullable<string> = null
    passwd: Nullable<string> = null
    passwdTime: Nullable<string> = null
    passwd2: Nullable<string> = null
    passwd2Time: Nullable<string> = null
    created: Nullable<string> = null
    stoped: Nullable<string> = null
}
