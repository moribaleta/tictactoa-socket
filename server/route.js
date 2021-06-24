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
                let session      = new Session()
                    session.name = query.name

                let user = this.socketconnection.lobby.getUser(user_id)

                if (user) {
                    session.players = user
                }
                this.socketconnection.lobby.addGameSession(session)
                res.json({
                    session
                })
                this.socketconnection.emitUserList()
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
    }

}


module.exports = Route