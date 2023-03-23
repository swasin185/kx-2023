// Server Entry Point เริ่มต้นทำงานเซิฟเวอร์
import express from 'express'
import session from 'express-session'
import Library from './Library.js'
import { Response } from 'express'
import https from 'https'
import fs from 'fs'
import Login from './services/Login.js'

console.log("LANG", process.env.LANG, new Date().toLocaleString())

const workDB = process.env.APIHOST || "kxtest"
// const nodeEnv = process.env.NODE_ENV || 'dev'
const clientDir = process.cwd() + "/client/"
const indexhtml = clientDir + "index.html"
const app = express()

Library.setDB(workDB)

app.use(
    session({
        secret: "swasin185@gmail.com",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            sameSite: 'strict',
            maxAge: 15 * 60_000, // millisec
        },
    })
)

app.use(express.json()) // Express >= 4.16  no need body-parser

// app.use((req: Request, res: Response, next: () => void) => {
//     res.header("Access-Control-Allow-Origin", req.headers.origin)
//     next()
// })

app.use(express.static(clientDir))

app.get("/", (res: Response) => res.sendFile(indexhtml))

Login.serve(app)

// openssl genrsa -out key.pem
// openssl req -new -key key.pem -out csr.pem
// openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
const sslKey = fs.readFileSync('../cert/key.pem')
const sslCert = fs.readFileSync('../cert/cert.pem')
const server = https.createServer({ key: sslKey, cert: sslCert }, app)
server.listen(Library.service.port)
// app.listen(Library.service.port)

console.info("dir:", process.cwd())
console.info("https://" + Library.getServerIP() + ":" + Library.service.port)

