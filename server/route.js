const {
    Session,
    User,
    Message
} = require('../__global/js/objects');

class Route {
    app
    socketconnection

    constructor(app, socketconnection) {
        this.app = app
        this.socketconnection = socketconnection

        this.utilityOperations()
        this.sessionOperations()
        this.userOperations()
    }

    utilityOperations() {
        this.app
            .get('/api/sessions', (req, res, next) => {
                console.log(req.query)
                res.json({
                    session: this.socketconnection.lobby.sessions
                })
            })//sessions

        this.app
            .get('/api/users', (req, res, next) => {
                console.log(req.query)
                res.json({
                    users: this.socketconnection.lobby.users
                })
            })//users
    }//utilityOperations

    sessionOperations() {
        this.app
            .post('/api/createSession', (req, res, next) => {
                console.log("createSession %o", req.body)
                let query        = req.body
                let user_id      = query.user_id
                var session      = new Session()
                    session.name = query.session.name

                let user = this.socketconnection.lobby.getUser(user_id)

                if (user) {
                    session.players = [user]
                }

                this.socketconnection.lobby.addGameSession(session)

                let message = new Message()
                message.data = session.toObject()
                res.json(message)
                this.socketconnection.emitSessionList()
            })//createSession
      
        this.app
          .post('/api/joinSession', (req, res, next) => {
             let query = req.body
             let user_id = query.user_id
             let session_id = query.session_id

             console.log(query)

             let session  = this.socketconnection.lobby.getSessionByID(session_id)
             let user     = this.socketconnection.lobby.getUser(user_id)
            
            let message = new Message()
             if(session && user) {
                console.log("session players %o", session.players)
                session.players.push(user)
                console.log("session players %o", session.players)
                message.data = session.toObject()
             } else if (!session) {
               message.error = "session doesnt exist"
             } else if (!user) {
               message.error = "user doesnt exist"
             } else {
               message.error = "unknown"
             }
            
             res.json(message)
             this.socketconnection.emitSessionList(session.id)
          })//joinSession

        this.app
          .get('/api/getSession', (req, res, next) => {
              let query = req.query
              let session_id = query.session_id
              console.log("getSession %o", req.params)

              let session = this.socketconnection.lobby.getSessionByID(session_id)

              var message = new Message()

              if (session) {
                message.data = session.toObject()
              } else {
                message.error = "Session doesnt exist"
              }
              res.json(message)
          })//getSession

    }//sessionOperations

    userOperations() {
        this.app
            .post('/api/createUser', (req, res, next) => {

                console.log("createUser %o", req.body)

                let query          = req.body
                let user           = new User()
                    user.username  = query.username
                    user.socket_id = query.socket_id
                this.socketconnection.lobby.addUser(user)

                let message = new Message()
                message.data = user.toObject()
                this.socketconnection.emitUserList()
                
                res.json(message)
            })//createUser

        this.app
          .get('/api/getUserById', (req, res, next) => {
            console.log("getUserById %o", req.query)
            let id        = req.query.id
            let user      = this.socketconnection.lobby.getUser(id)
            let message   = new Message()
            message.data  = null
            if (user) {
                message.data = user.toObject()
            } else {
                message.error = "user not found"
            }
            res.json(message)
          })//getUserById

    }//userOperations

}


module.exports = Route