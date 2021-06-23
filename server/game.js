const {Session} = require('../__global/js/objects')
const {Utilities} = require('../__global/js/utilities')

/*class Game {

    id

    users = [
        ///User objects
    ]

    session = new Session()

    constructor() {
        this.id = Utilities.keyGenID('game', 3)
    }
    
    addUser(user) {
        this.users.push(user)
    }

    updateSession(session) {
        this.session = session
    }
}*/


class Lobby {

    /**
     * current server contains all the game being played
     * */
    sessions = [
        ///Session
    ]

    /**
     * contains all the users connected to the server
     */
    users = [
        ///User
    ]


    /**
     * returns the game session
     * @param {*} id - id of the game session to retrieve
     */
    getSessionByID(id) {
        return this.sessions.findById(id)
    }//getGameSessionByID

    /**
     * adds a new game session to the array games
     * @param {*} game - Session class type
     */
    addGameSession(session) {
        this.sessions.push(session)
    }//addGameSession

    updateSession(session) {
        const index = this.sessions.findIndexById(session.id)
        if (index > -1) {
            this.sessions[index] = session
        }
    }//updateSession

    /**
     * resets the session to create a new game within the same session
     * @param {*} session 
     */
    resetSession(session) {
        let index = this.sessions.findIndexById(session.id)
        if (index > -1) {
            let session = this.sessions[index]
            session.reset()
        }
    }

    /**
     * removes the game from the games
     * @param {*} id - id of the game to be removed
     */
    removeGameById(id) {
        const index = this.sessions.findIndex(id)
        if (index > -1) {
            this.sessions.splice(index, 1)
        }
    }//removeGameById

    /**
     * adds a new user to the users array
     * @param {*} user 
     */
    addUser(user) {
        this.users.push(user)
    }//addUser

    /**
     * removes the user from the array by userid
     * @param {*} id 
     */
    logoutUser(id) {
        const index = this.users.findIndex(id)

        this.sessions.forEach((session) => {
          this.removeUserFromSession(session.id, id)
        })

        if(index > -1) {
            this.users.splice(index, 1)
        }
    }//removeUser


    /**
     * removes the player from the specified session
     * @returns user from the session removed else null
     * @param {*} session_id - id of the session
     * @param {*} user_id - id of the user to be removed
     */
    removeUserFromSession(session_id, user_id) {
      let session = this.sessions.findById(session_id)
      if(session) {
        let index = session.players.findIndexById(user_id)
        if (index > -1) {
          return session.players.splice(index, 1)
        }
      }
      return null
    }//removeUserFromSession
    

    /**
     * returns the user from the array by id
     * @param {*} id 
     * @returns User
     */
    getUser(id) {
        return this.users.findById(id)
    }//getUser

}//Lobby


/**
 * search for the object with id 
 * @param {*} id 
 * @returns index of object from the array
 */
Array.prototype.findIndexById = (id) => {
    return this.findIndex((object) => {
        return object.id == id
    })
}

/**
 * search for the object with id 
 * @param {*} id 
 * @returns Any
 */
Array.prototype.findById = (id) => {
    return this.find((object) => {
        return object.id == id
    })
}


module.exports = {
    Lobby
}