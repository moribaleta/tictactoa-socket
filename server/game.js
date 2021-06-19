const {Session} = require('../__global/js/objects')

class Game {

    users = [
        ///User objects
    ]

    session = new Session()
    
    addUser(user) {
        this.users.push(user)
    }

    updateSession(session) {
        this.session = session
    }
}



module.exports = {
    Game
}