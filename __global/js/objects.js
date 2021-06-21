const {
    Utilities
} = require('./utilities');

/**
 * object structure of Message response from Datahandler
 */
class Message {
    /** contains the data */
    data
    /** contains error if any */
    error
} //Message

/**
 * Base class for any models with id and date created and updated
 */
class Model {
    ///unique id specified for the model created
    id
    ///date the model was created
    date_created = new Date()
    ///date the model was updared
    date_updated = new Date()
} //Model

/**
 * lobby created
 */
class Lobby extends Model {

    users = []
    isPrivate = false
    password = ""

    constructor(id, date_created, date_updated,
        users, isPrivate, password) {
        super()
        this.id = id || Utilities.keyGenID('lobby', 5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.users = users || []
        this.isPrivate = isPrivate || false
        this.password = password || ""
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            users: [...this.users],
            isPrivate: this.isPrivate,
            password: this.password
        }
    }

    copy() {
        return Lobby.parse(this.toObject())
    }

    static parse(object) {
        let lobby = new Lobby()
        lobby.id = object.id
        lobby.date_created = object.date_created
        lobby.date_updated = object.date_updated
        lobby.users = [...(object.users || [])]
        lobby.isPrivate = isPrivate || false;
        lobby.password = password || ""

        return lobby
    }

} //Lobby


/**
 * user object extends Model
 * has username
 */
class User extends Model {

    username

    constructor(id, date_created, date_updated,
        username) {
        super()
        this.id = id || Utilities.keyGenID('user', 5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.username = username || ""
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            username: this.username
        }
    }

    copy() {
        return User.parse(this.toObject())
    }

    static parse(object) {
        let user = new User()
        user.id = object.id
        user.date_created = object.date_created
        user.date_updated = object.date_updated
        user.username = object.username
        return user
    }

} //User



/**
 * different state of the game
 */
const GameState = {
    setplayer   : "setplayer",
    create      : "create",
    playing     : "playing",
    finish      : "finish"
}

/**
 * class contains the game session
 */
 class Session extends Model {
    table      = []
    table_size = {
        row: 3,
        col: 3
    }

    player_turn = 1
    winner      = null

    ///state of session
    state = GameState.create

    player_spec = {
        1: null,
        2: null
    }

    players = []
    chat    = []

    constructor(id, date_created, date_updated,
        table, table_size, player_turn, player_spec, players, state, winner, chat) {
        super()
        this.id           = id || Utilities.keyGenID('session', 5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.table        = table || []
        this.players      = players || []

        this.table_size   = table_size || {
            row: 3,
            col: 3
        }

        this.player_turn = player_turn
        this.winner      = winner
        this.player_spec = player_spec
        this.state       = state || GameState.setplayer
        this.chat        = chat  || []
    }

    toObject() {
        return {
            id          : this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            table       : this.table,
            table_size  : this.table_size,
            player_turn : this.player_turn,
            winner      : this.winner,
            player_spec : this.player_spec,
            state       : this.state,
            players     : this.players,
            chat        : this.chat.map((chat) => {
              return chat.toObject()
            })
        }
    }

    copy() {
        return Session.parse(this.toObject())
    }

    static parse(object) {
        let session              = new Session()
            session.id           = object.id
            session.date_created = object.date_created
            session.date_updated = object.date_updated
            session.table        = object.table
            session.table_size   = object.table_size
            session.player_turn  = object.player_turn
            session.winner       = object.winner
            session.player_spec  = object.player_spec
            session.state        = object.state
            session.players      = object.players
            session.chat         = (object.chat || []).map((chatobj) => {
              return UserMessage.parse(chatobj)
            })
        return session
    }
} //Session


/**
 * class contains all chat
 */
 class UserMessage extends Model {

    message = ""
    user_id 

    constructor(id, date_created, date_updated,
        user_id, message) {
        super()
        this.id = id || Utilities.keyGenID('message', 5)
        this.date_created = date_created || new Date()
        this.date_updated = date_updated || new Date()
        this.user_id = user_id || ""
        this.message = message || ""
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            date_updated: this.date_updated,
            user_id: this.user_id,
            message: this.message,
        }
    }

    copy() {
        return UserMessage.parse(this.toObject())
    }

    static parse(object) {
        let userMessage = new UserMessage()
        userMessage.id = object.id
        userMessage.date_created = object.date_created
        userMessage.date_updated = object.date_updated
        userMessage.user_id = object.user_id
        userMessage.message = object.message
        return userMessage
    }

}



module.exports = {
    Lobby,
    Model,
    User,
    Message,
    Session,
    UserMessage
}