const {Session, User, Message} = require('../__global/js/objects');

class Route {
    app
    socketconnection

    constructor(app, socketconnection) {
        this.app = app
        this.socketconnection = socketconnection

        this.app
            .get('/api/lobbies', (req, res, next) => {
                console.log(req.query)
                res.json({
                    session: socketconnection.lobby.sessions
                })
            })

        this.app
            .get('/api/users', (req, res, next) => {
                console.log(req.query)
                res.json({
                    session: socketconnection.lobby.users
                })
            })

        this.app
            .post('/api/createUser', (req, res, next) => {

                console.log("createUser %o", req.query)

                let query         = req.query
                let username      = query.username
                let user          = new User()
                    user.username = username
                socketconnection.lobby.addUser(user)

                let message     = new Message()
                message.data    = user.toObject()
                res.json(message)
            })

        this.app
            .post('/api/createSession', (req, res, next) => {
                let query       = req.params
                let user_id     = query.user_id
                let session     = new Session()
                session.name    = query.name

                let user = socketconnection.lobby.getUser(user_id)

                if (user) {
                    session.players = user
                }
                socketconnection.lobby.addGameSession(session)
                res.json({
                    session
                })
            })

    }

}


module.exports = Route