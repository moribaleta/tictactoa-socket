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
                    help  : req.query.help,
                    session: socketconnection.lobby.sessions
                })
            })

        this.app
            .post('/api/createSession', (req, res, next) => {

            })

    }

}


module.exports = Route