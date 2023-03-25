import VatItem from "./VatItem"

export default class ShareLib {
    public static readonly HOST: string = "192.168.1.10"
    public static readonly locale = "en-GB" // dd/MM/yyyy
    public static readonly fr_ca = "fr-CA" // yyyy-MM-dd
    public static readonly VAT = 7
    public static readonly VATDC = Math.floor(1E5 - 1E7 / (100 + ShareLib.VAT)) / 1E3;
    public static dateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(\.\d{1,3})?)Z$/

    public static test() {
        console.time("test")
        console.assert(ShareLib.encode("abcd1234") == "5D59595D5D59595D3433323164636261", "encode() Error")
        console.log(ShareLib.formatDateTime(new Date()), 'Test...')
        let y = ShareLib.formatMoney(-1234567.8853)
        console.assert(y == "-1,234,567.89", y + "  formatMoney() Error")
        let x = ShareLib.moneyText("-1,234,567.8853")
        console.assert(
            ShareLib.moneyThaiText(x) == "ลบหนึ่งล้านสองแสนสามหมื่นสี่พันห้าร้อยหกสิบเจ็ดบาทแปดสิบเก้าสตางค์",
            ShareLib.moneyThaiText(x)
        )
        console.assert(x == -1234567.89, x + " moneyText() Error")
        x = ShareLib.moneyText("-234,567.8853")
        console.assert(
            ShareLib.moneyThaiText(x) == "ลบสองแสนสามหมื่นสี่พันห้าร้อยหกสิบเจ็ดบาทแปดสิบเก้าสตางค์",
            ShareLib.moneyThaiText(x)
        )
        console.assert(ShareLib.moneyThaiText(0) == "", ShareLib.moneyThaiText(0))
        console.assert(x == -234567.89, x + " moneyText() Error")
        let z: VatItem = { qty: 1, price: 130, discount: 0, total: 0, item: 0, vat: 0 }
        ShareLib.calcItem(z, true)
        // console.info(z)
        console.assert(ShareLib.moneyThaiText(z.total) == "หนึ่งร้อยสามสิบบาทถ้วน")
        console.assert(ShareLib.moneyThaiText(z.item) == "หนึ่งร้อยยี่สิบเอ็ดบาทห้าสิบสตางค์")
        console.assert(ShareLib.moneyThaiText(z.vat) == "แปดบาทห้าสิบสตางค์")
        console.assert(ShareLib.round(z.item, 6) == 121.495327, z.item + " totalItem Error")
        console.assert(ShareLib.round(z.vat, 6) == 8.504673, z.vat + " totalVat Error")
        z = { qty: 1, price: 90, discount: 0, total: 0, item: 0, vat: 0 }
        ShareLib.calcItem(z, true)
        console.assert(ShareLib.moneyThaiText(z.total) == "เก้าสิบบาทถ้วน")
        console.assert(ShareLib.moneyThaiText(z.item) == "แปดสิบสี่บาทสิบเอ็ดสตางค์")
        console.assert(ShareLib.moneyThaiText(z.vat) == "ห้าบาทแปดสิบเก้าสตางค์")
        console.assert(ShareLib.round(z.item, 6) == 84.11215, z.item + " totalItem Error")
        console.assert(ShareLib.round(z.vat, 6) == 5.88785, z.vat + " totalVat Error")
        const d = new Date("2024-02-29")
        // const d = new Date(2020,1,29, 7, 0, 0)
        console.assert(ShareLib.formatDateDB(d) == "2024-02-29", ShareLib.formatDateDB(d) + " formatDateDB() Error!")
        console.assert(ShareLib.formatDate(d) == "29/02/24", ShareLib.formatDate(d) + " formatDate() Error!")
        console.assert(
            ShareLib.formatDateTime(d) == "29/02/24[07:00:00]",
            ShareLib.formatDateTime(d) + " formatDateTime() Error!"
        )

        console.assert(ShareLib.round(271.495, 2) == 271.5, "positive round Error! " + ShareLib.round(-271.495, 2))
        console.assert(ShareLib.round(-271.495, 2) == -271.5, "negative round Error! " + ShareLib.round(-271.495, 2))
        console.assert(ShareLib.round(0.4949999999, 2) == 0.5, "Round Error! " + ShareLib.round(0.4949999999, 2))
        const size = 5E5
        let item: VatItem = { qty: 1, price: 0, discount: 0, total: 0, item: 0, vat: 0 }
        let total: VatItem = { qty: 1, price: 0, discount: 0, total: 0, item: 0, vat: 0 }
        for (let i = -size; i <= size; i++) {
            item.price = i
            ShareLib.calcItem(item, true)
            total.item += ShareLib.round(item.item, 2)
            total.vat += ShareLib.round(item.vat, 2)
            ShareLib.moneyThaiText(total.item)
        }
        total.item = ShareLib.roundMoney(total.item)
        total.vat = ShareLib.roundMoney(total.vat)
        total.total = total.item + total.vat
        console.assert(total.total == 0, "calculate Error!")
        console.log(total)
        console.timeEnd("test")
    }

    public static round(x: number, digit: number): number {
        x = parseFloat(Math.round(parseFloat(x + "E9")) + "E-9")
        if (x == 0) return 0.0
        if (x > 0)
            return parseFloat(Math.round(parseFloat(x + "E" + digit)) + "E-" + digit)
        else
            return -parseFloat(Math.round(parseFloat(-x + "E" + digit)) + "E-" + digit)
    }

    public static roundMoney(x: number): number {
        return ShareLib.round(x, 2)
    }

    public static moneyText(text: string): number {
        const x = parseFloat(text.replace(/,/g, ""))
        return ShareLib.roundMoney(x)
    }

    public static formatMoney(money: number): string {
        const x = ShareLib.roundMoney(money).toString()
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    private static readonly moneyUnit = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"]

    private static readonly moneyDigit = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"]

    public static moneyThaiText(money: number): string {
        let sb: string[] = []
        if (money != null) {
            const s = Math.round(money * 100).toFixed()
            let i = 0
            let satang = false
            let baht = false
            let zero = true
            for (let j = s.length - 1; j >= 0; j--) {
                let x = s.charCodeAt(j) - 48
                let w = 0
                if (j > 0) w = s.charCodeAt(j - 1) - 48
                if (i == 0 && satang && !baht && x >= 0) {
                    sb.unshift("บาท")
                    baht = true
                }
                if (x > 0 || (x >= 0 && i == 6))
                    sb.unshift(ShareLib.moneyUnit[i])
                if (x > 0) {
                    if (i == 1 && x == 2) sb.unshift("ยี่")
                    else if (i == 0 && x == 1 && w > 0) sb.unshift("เอ็ด")
                    else if (i != 1 || x != 1) sb.unshift(ShareLib.moneyDigit[x])
                    zero = false
                } else if (x == -3)
                    sb.unshift("ลบ")

                if (i == 1 && !satang) {
                    i = 0
                    if (!zero) sb.push("สตางค์")
                    else sb.push("ถ้วน")
                    satang = true
                } else if (i == 6)
                    i = 1
                else
                    i++
            }
        }
        return sb.join("")
    }

    public static calcItem(i: VatItem, incVat: boolean): void {
        if (incVat) {
            i.total = i.qty * i.price * (100 - i.discount)
            i.item = i.total / (100 + ShareLib.VAT)
            i.total /= 100
            i.vat = i.total - i.item
        } else {
            i.item = i.qty * i.price * (100 - i.discount)
            i.vat = i.item * ShareLib.VAT
            i.total = (i.item + i.vat) / 100
        }
    }

    public static shortDateFormat: any = { timeZone: "Asia/Bangkok", day: "2-digit", month: "2-digit", year: "2-digit" }

    public static dateFormat: any = { timeZone: "Asia/Bangkok", day: "2-digit", month: "2-digit", year: "numeric" }

    public static timeFormat: any = {
        timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", second: "2-digit"
    }

    public static formatDate(d: Date): string {
        return d.toLocaleDateString(ShareLib.locale, ShareLib.dateFormat)
    }

    public static formatDateDB(d: Date): string {
        return d.toLocaleDateString(ShareLib.fr_ca, ShareLib.dateFormat)
    }

    public static formatTime(d: Date): string {
        return d.toLocaleString(ShareLib.locale, ShareLib.timeFormat)
    }

    public static formatDateTime(d: Date): string {
        return d.toLocaleDateString(ShareLib.locale, ShareLib.shortDateFormat) +
            "[" + d.toLocaleTimeString(ShareLib.locale, ShareLib.timeFormat) + "]"
    }

    public static encode(plain: string): string {
        let cipher: string = ""
        if (plain) {
            let arr: number[] = new Array(16)
            let i = 0
            while (i < arr.length) {
                arr[i] = plain.charCodeAt(i % plain.length)
                i++
            }
            for (i = 0; i < arr.length; i++)
                arr[i] ^= arr[arr.length - 1 - i] ^ plain.length
            cipher = ShareLib.toHex(arr)
        }
        return cipher
    }

    private static readonly HEX = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]

    private static toHex(arr: number[]) {
        let sb: string = ""
        for (let data of arr)
            sb += ShareLib.HEX[(data >> 4) & 0xf] + ShareLib.HEX[data & 0xf]
        return sb
    }
}
