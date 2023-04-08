import express, { Application, Request, Response } from "express"
import getClientIp from "get-client-ip"
import Session from "./shared/Session.js"
import AdminImpl from "./services/AdminImpl.js"
import BaseImpl from "./services/BaseImpl.js"

export default class Service {
    // Plugin service implements
    private static readonly implements = [BaseImpl, AdminImpl]

    private static readonly serviceList: string[] = []
    private static readonly apiURL = "/api/"
    private static readonly servLogin = Service.apiURL + 'login'
    private static readonly servSession = Service.apiURL + 'session'
    private static servCount = 0

    public static main(app: Application) {
        app.use(express.static(process.cwd() + "/client", { maxAge: 86_400_000 }))
        app.get("/", (res: Response) => res.sendFile("index.html"))
        app.get(Service.apiURL,
            (request: Request, response: Response) => response.send(Service.serviceList))

        Service.implements.forEach(
            (impl) => Service.serve(app, impl))

        app._router.stack.forEach((middleware: any) => {
            if (middleware.route)
                Service.serviceList.push(Object.keys(middleware.route.methods).toString() + ":" + middleware.route.path)
        })
        Service.serviceList.sort()
        console.log("services", Service.serviceList.length, Service.serviceList)
    }

    private static serve(app: Application, servImpl: any) {
        const serviceNames = Object.getOwnPropertyNames(servImpl)
            .filter(
                name => typeof Object.getOwnPropertyDescriptor(servImpl, name)?.value == 'function')
            .forEach(
                name => Service.post(app, (servImpl as any)[name])
            )
    }

    private static post(app: Application, service: any): void {
        if (Service.serviceList.includes(service.name)) {
            console.error("Error!! service: Duplicated", service.name)
            return
        }

        app.post(Service.apiURL + service.name, async (request: Request, response: Response) => {
            Service.servCount++;
            const time = new Date()
            const conn: Session = (request.session as any).connect
            if (conn?.level > -1 ||
                request.path == Service.servLogin ||
                request.path == Service.servSession)
                response.json(await service(request))
            else
                response.status(401).send("Session Unauthorized")

            Service.log(service.name, time, request, response)
        })
    }

    private static log(servName: string, time: Date, request: any, response: any) {
        const size = response.getHeader('Content-Length') / 1000
        const elapse = (Date.now() - time.getTime()) / 1000
        console.log(Service.servCount.toString().padStart(5, ' '),
            time.toLocaleTimeString(),
            servName.padEnd(20, ' '),
            getClientIp(request)?.replace("::ffff:", "").padEnd(15, ' '),
            size.toFixed(3).padStart(10, ' '), "kB",
            elapse.toFixed(3).padStart(10, ' '), "sec")
    }

}
