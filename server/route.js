const {Session} = require('../__global/js/objects');

class Route {
    app
    socketconnection

    constructor(app, socketconnection) {
        this.app = app
        this.socketconnection = socketconnection

        //https://tictactoa-socket.moribaleta.repl.co/api/lobbies?id=123&count=10
        this.app
            .get('/api/lobbies', (req, res, next) => {
                console.log("user request %o", req.query)
                res.json({
                    session: socketconnection.lobby.sessions
                })
            })

        this.app
          .get('/api/users', (req, res, next) => {
            console.log(req.query)
                res.json({
                    users: socketconnection.lobby.users
                })
          })

        this.app
            .post('/api/createSession', (req, res, next) => {
                let query       = req.query
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