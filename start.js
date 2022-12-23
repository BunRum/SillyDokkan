const express = require("express");
var fs = require("fs")
const path = require('path')
var https = require("https");
var ip = require('ip')

var ipaddress = ip.address()
const PORT = 8081
// console.log(Server.ServerStart/)
var fulladdress = `https://${ipaddress}:${PORT}`

const creds = {
    cert: fs.readFileSync("cert.pem"),
    key: fs.readFileSync("key.pem")
}

const app = express();

app.use(express.text())
app.use(express.json())
app.use(express.static('public'))
app.disable('etag')

app.use(function (req, res, next) {
    // console.log(res.headers["connect-src"])
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

const sslServer = https.createServer(creds, app)
sslServer.listen(PORT)

console.log(`Web server started at: ${fulladdress}`);
module.exports = {
    ipaddress: ipaddress,
    port: PORT,
    fulladdress: fulladdress
}

app.get("/certs", (req, res) => {
    res.sendFile(path.join(process.env.LOCALAPPDATA, "mkcert","rootCA.pem"))
})

require("./Server").ServerStart(app)


// require("./uifunctions").uifunctions(app)
