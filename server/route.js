const {Session} = require('../__global/js/objects');

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