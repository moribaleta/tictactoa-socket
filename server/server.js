const path      = require('path')
const express   = require('express')
const http      = require('http')
const socketIO  = require('socket.io')

const {User, Message, Session} = require('../__global/js/objects')
const {Game, Lobby} = require('./game')
const {Utilites} = require('../__global/js/utilities')

const publicPath = path.join(__dirname + "/../public")
const port = process.env.PORT || 3000

let app    = express()
let server = http.createServer(app)
let io     = socketIO(server)

app.use(express.static(publicPath))

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

let lobby = new Lobby()

io.on('connection', (socket) => {
    console.log('a new user just connected')

    socket.on('createUser', (data) => {
        var message = new Message()
        
        /*if (game.users.length < 2) {
            let user        = new User()
            user.username   = data.username
            game.addUser(user)
            message.data = user.toObject()
            socket.emit('onUserCreated', message)    
        } else {
            message.error = "game lobby occupied"
            socket.emit('onUserCreated', message)
        }*/

        /*let userconnected   = new Message()
        userconnected.data  = game.users
        io.emit("lobbyUsers", userconnected)
        console.log("lobby users %o", game.users )*/
    })//createUser


    socket.on('createSession', (session) => {
        console.log("session created %o", session)
        let _session = Session.parse(session)
        lobby.updateSession(_session)
        //console.log(lobby.session.toObject())
        let sessionMessage  = new Message()
        sessionMessage.data = _session
        
        io.emit('onSession', sessionMessage)

        
        if (_session.winner) {
            let winnerMessage   = new Message()
            winnerMessage.data  = _session.winner
            io.emit('onWinner', winnerMessage)
            
            _session.reset()
            let sessionMessage  = new Message()
            sessionMessage.data = _session
            io.emit('onSession', sessionMessage)
            //game.session = new Session()
        }
    })//createSession

    socket.on('removeUser', (user) => {
        let index = game.users.findIndex((_user) => {
            return _user.id == user.id
        })

        if (index > -1) {
            game.users.splice(index, 1)
        }
        
        game.session = new Session()
    })//removeUser


    let userconnected   = new Message()
    userconnected.data  = game.users
    io.emit("lobbyUsers", userconnected)
    console.log("lobby users %o", game.users )

    let sessionMessage = new Message()
    sessionMessage.data = game.session.toObject()
    io.emit("onSession", sessionMessage)

    socket.on('disconnect', () =>{
        console.log('user was disconnected')
    })//disconnect
})

