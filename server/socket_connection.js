const {User, Message, Session} = require('../__global/js/objects')
const {Lobby} = require('./game')

const socket_events = {
    createUser   : 'createUser',
    onUserCreated: 'onUserCreated',
    updateSession: 'updateSession',
    onSession    : 'onSession',
    onWinner     : 'onWinner',
    removeUser   : 'removeUser',
    lobbyUsers   : 'lobbyUsers',
    disconnect   : 'disconnect',
    getSession   : 'getSession',
    quitSession  : 'quitSession',
    userlist     : 'userlist',
    sessionlist  : 'sessionlist'
}

class SocketConnect {
    
    lobby   = new Lobby()
    io      = null

    constructor(io) {
        this.io = io

        this.io.on('connection', (client) => {
            console.log('a new user just connected')
            this.setupClient(client)
        })
    }

    emitUserList() {
        let message = new Message()
        message.data = this.lobby.users
        this.io.emit(socket_events.userlist, message)
    }

    emitSessionList(){
        let message = new Message()
        message.data = this.lobby.sessions
        this.io.emit(socket_events.sessionlist, message)
    }

    setupClient(client){
       this.onCreateUser(client)
       this.onSessionUpdate(client)
       this.onRemoveUser(client)
       this.onDisconnect(client)
    }

    onCreateUser(client) {
        client.on(socket_events.createUser, (data) => {
            let user        = new User()
            user.username   = data.username
            let message     = new Message()
            message.data    = user.toObject()
            client.emit('onUserCreated', message)    
            this.lobby.addUser(user)
            
            let userconnected   = new Message()
            userconnected.data  = this.lobby.users
            this.io.emit("this.lobbyUsers", userconnected)
            console.log("this.lobby users %o", this.lobby.users )
        })
    }

    onSessionUpdate(client) {
        client.on(socket_events.updateSession, (session) => {
            console.log("session created %o", session)
            lobby.updateSession(Session.parse(session))
            console.log(this.lobby.session.toObject())
            let sessionMessage = new Message()
            //sessionMessage.data = lobby.session.toObject()
            
            this.io.emit(socket_events.onSession, sessionMessage)
    
            
            if (session.winner) {
                let winnerMessage = new Message()
                winnerMessage.data =  session.winner
                this.io.emit(socket_events.onWinner, winnerMessage)
                this.lobby.session = new Session()
            }
        })
    }

    onRemoveUser(client) {
        client.on(socket_events.removeUser, (user) => {
            let index = this.lobby.users.findIndex((_user) => {
                return _user.id == user.id
            })
    
            if (index > -1) {
                this.lobby.users.splice(index, 1)
            }
            
            this.lobby.session = new Session()
        })
    }

    onDisconnect(client) {
        client.on(socket_events.disconnect, () =>{
            console.log('user was disconnected')
        })
    }

}//SocketConnect


//const SocketConnection = new SocketConnect()

module.exports = {
    SocketConnect,
    //SocketConnection
}