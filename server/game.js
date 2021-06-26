const {Session} = require('../__global/js/objects')
const {Utilities} = require('../__global/js/utilities')

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
        return findArrayById(this.sessions, id)
    }//getGameSessionByID

    /**
     * adds a new game session to the array games
     * @param {*} game - Session class type
     */
    addGameSession(session) {
        this.sessions.push(session)
        console.log("addGameSession %o", this.sessions)
    }//addGameSession

    updateSession(session) {
        const index = findArrayIndexById(this.sessions, session.id)
        if (index > -1) {
            this.sessions[index] = session
        }
    }//updateSession

    /**
     * resets the session to create a new game within the same session
     * @param {*} session 
     */
    resetSession(session) {
        let index = findArrayIndexById(this.sessions, session.id)
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
        const index = findArrayIndexById(this.sessions, id)
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
        const index = findArrayIndexById(this.users, id)

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
      let session = findArrayById(this.sessions, session_id)
      if(session) {
        let index = findArrayIndexById(session.players, user_id)
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
        //return this.users.findArrayById(id)
        let index = findArrayIndexById(this.users, id)
        return index > -1 ? this.users[index] : null
    }//getUser

}//Lobby


/**
 * search for the object with id 
 * @param {*} id 
 * @returns index of object from the array
 */
const findArrayIndexById = (arr, id) => {
    return arr.findIndex((object) => {
        return object.id == id
    })
}

/**
 * search for the object with id 
 * @param {*} id 
 * @returns Any
 */
const findArrayById = (arr, id) => {
    return arr.find((object) => {
        return object.id == id
    })
}


module.exports = {
    Lobby
}