const {User, Message, Session} = require('../__global/js/objects')
const {Lobby} = require('./game')

const socket_events = {
    socketid     : 'socketid', 
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
    sessionlist  : 'sessionlist',
    updatclient  : 'updateclient'
}

class SocketConnect {
    
    lobby   = new Lobby()
    io      = null
    clients = {}

    constructor(io) {
        this.io = io

        this.io.on('connection', (client) => {
            console.log('a new user just connected')
            this.clients[client.socket_id] = client
            client.emit(socket_events.socketid, client.id)
            console.log("socket id %o", client.id)
            this.setupClient(client)
        })
    }

    /**
     * emit the latest list of users
     */
    emitUserList() {
        let message = new Message()
        message.data = this.lobby.users
        this.io.emit(socket_events.userlist, message)
    }//emitUserList

    /**
     * emit the latest list of sessions
     * {*} session_id - emit to a specific session
     */
    emitSessionList(session_id = null){
        if (session_id) {
            let session = this.lobby.getSession(session_id)
            let message = Message.create(session.toObject())
            
            console.log(`updating session from ${session_id}`)
            
            session.players.forEach((player) => {
                console.log(`updating session for ${player.id}`)
                
                this.clients[player.id]
                    .emit(socket_events.updateSession,message)
            })
        } else {
            this.io.emit(
                    socket_events.sessionlist,
                    Message.create(this.lobby.sessions))
        }
    }//emitSessionList

    /**
     * emit the winner on specific session
     * @param {*} session_id - session to be broadcasted
     * @returns 
     */
    emitOnWinner(session_id) {
        if (!session_id) {
            return
        }

        let session         = this.lobby.getSession(session_id)
        let winnerMessage   = Message.create(session.winner)

        session.players.forEach((player) => {
            this.clients[player.id]
                .emit(socket_events.onWinner, winnerMessage)
        })
    }//emitOnWinner

    setupClient(client){
       this.onCreateUser(client)
       this.onSessionUpdate(client)
       this.onRemoveUser(client)
       this.onDisconnect(client)
    }//setupClient

    onCreateUser(client) {
        client.on(socket_events.createUser, (data) => {
            let user        = new User()
            user.username   = data.username
            user.socket_id  = client.id
            let message     = new Message()
            message.data    = user.toObject()
            client.emit('onUserCreated', message)    
            this.lobby.addUser(user)
            
            let userconnected   = new Message()
            userconnected.data  = this.lobby.users
            this.io.emit("this.lobbyUsers", userconnected)
            console.log("this.lobby users %o", this.lobby.users )
            this.clients[user.id] = client
        })

        client.on(socket_events.updatclient, (data) => {
            this.clients[data.user_id] = client
            console.log("client updated %o", client.id)
        })
    }//onCreateUser

    onSessionUpdate(client) {
        client.on(socket_events.updateSession, (session) => {
            console.log("session updated %o", session)
            this.lobby.updateSession(Session.parse(session))
            this.emitSessionList(session.id)
            if (session.winner) {
                this.emitOnWinner(session.id)
                this.lobby.resetSession(session)
            }
        })
    }//onSessionUpdate

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
    }//onRemoveUser

    onDisconnect(client) {
        client.on(socket_events.disconnect, () =>{
            console.log('user was disconnected')
        })
    }//onDisconnect

}//SocketConnect


//const SocketConnection = new SocketConnect()

module.exports = {
    SocketConnect,
    //SocketConnection
}