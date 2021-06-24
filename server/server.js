const path      = require('path')
const express   = require('express')
const http      = require('http')
const socketIO  = require('socket.io')
const {SocketConnect} = require('./socket_connection')
const Route = require('./route')
const bodyParser = require('body-parser')

const publicPath = path.join(__dirname + "/../public")
const port = process.env.PORT || 3000

let app    = express()
let server = http.createServer(app)
let io     = socketIO(server)

app.use(express.static(publicPath))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

const SocketConnection  = new SocketConnect(io)
const RouteConnection   = new Route(app, SocketConnection)
