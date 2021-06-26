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
            })

        this.app
            .get('/api/users', (req, res, next) => {
                console.log(req.query)
                res.json({
                    users: this.socketconnection.lobby.users
                })
            })
    }

    sessionOperations() {
        this.app
            .post('/api/createSession', (req, res, next) => {
                console.log("createSession %o", req.body)
                let query        = req.body
                let user_id      = query.user_id
                var session      = new Session()
                    session.name = query.session.name

                /*let user = this.socketconnection.lobby.getUser(user_id)

                if (user) {
                    session.players = [user]
                }*/
                this.socketconnection.lobby.addGameSession(session)
                res.json({
                    session
                })
                this.socketconnection.emitUserList()
            })
      
        this.app
          .post('/api/joinSession', (req, res, next) => {
             let query = req.query
             let user_id = query.user_id
             let session_id = query.session_id

             let session  = this.socketconnection.lobby.getSessionByID(session_id)
             let user     = this.socketconnection.lobby.getUser(user_id)
            
            let message = new Message()
             if(session && user) {
               session.players.push(user)
                message.data = session.toObject()
             } else if (!session) {
               message.error = "session doesnt exist"
             } else if (!user) {
               message.error = "user doesnt exist"
             } else {
               message.error = "unknown"
             }
            
             res.json(message)
          })
    }

    userOperations() {
        this.app
            .post('/api/createUser', (req, res, next) => {

                console.log("createUser %o", req.body)

                let query         = req.body
                let username      = query.username
                let user          = new User()
                    user.username = username
                this.socketconnection.lobby.addUser(user)

                let message = new Message()
                message.data = user.toObject()
                this.socketconnection.emitUserList()
                
                res.json(message)
            })

        this.app
          .get('/api/getUserById', (req, res, next) => {
            console.log("getUserById %o", req.query)
            let id        = req.query.id
            let user      = this.socketconnection.lobby.getUser(id)
            let message   = new Message()
            message.data  = null
            if (user) {
              message.data = user.toObject()
            }
            res.json(message)
          })
    }

}


module.exports = Route