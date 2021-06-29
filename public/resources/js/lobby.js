const app = new Vue({
  el: '#app',
  data: {
    username: "",
    user: {},
    users: [],
    sessions: [],
    socket: io(),
    session_input: {},
    connected: false,
  },

  methods: {

    onStart() {
      this.socket.on("connect", () => {
        console.log("connected to the server")
        this.connected = true;
      })

      this.socket.on('disconnect', () => {
        console.log("disconnected from the server")
        this.connected = false
      })

      this.socket.on('sessionlist', (message) => {
        console.log("message %o", message)
        this.sessions = [...message.data]
      })

      let _user = localStorage.getItem('user') || "{}"
      console.log(_user)
      if (_user != "{}") {
        this.user = User.parse(JSON.parse(_user))
        console.log("user %o", this.user)
        this.fetchData()
      } else {
        window.open("index.html", '_self')
      }
    },//onStart

    fetchData() {
      $.get('/api/users')
        .then((res) => {
          console.log(res)
          this.users = res.users
        }).catch((err) => {
          console.log(err)
        })

      $.get('/api/sessions')
        .then((res) => {
          console.log(res)
          this.sessions = [...res.session]
        }).catch((err) => {
          console.log(err)
        })
    },//fetchData

    openGame(user) {
      console.log(user)
      let _user = JSON.stringify(user)
      console.log(_user)
      localStorage.setItem('user', _user)
      window.open('lobby.html', '_self')
    },//openGame

    onCreateGame() {
      $('#newGameModal').modal()
      this.session_input = new Session()
    },//onCreateGame

    onSaveGame() {
      this.session_input.players.push(this.user.id)
      let object = {
        user_id: this.user.id,
        session: this.session_input.toObject()
      }
      $.post('/api/createSession', object)
        .then((res) => {
          console.log(res)
          window.open('game.html?session_id='+res.data.id, '_self')
        }).catch((err) => {
          console.log(err)
        })
    },//onSaveGame

    onJoinGame(index) {
      var user_id = this.user.id
      let session = this.sessions[index]

      if (session.players.length < 2) {
        let isAccept = confirm("Do you want to join game?")
        if (isAccept == true) {
          let request = {
            user_id: user_id,
            session_id: session.id
          }
          $.post('/api/joinSession', request)
            .then((res) => {
              console.log(res)
              if (res.error) {
                throw res.error
              } else {
                console.log(res.data)
                window.open('game.html?session_id='+res.data.id, '_self')
              }
            }).catch((err) => {
              alert(err)
            })
        }
      } else {
        alert("Game session is full")
      }
    },//onJoinGame

    onLogOut() {
      localStorage.setItem('user', '{}')
      this.socket.emit('removeUser', this.user)
      window.open("index.html", '_self')
    },//onLogOut
  }
})

$(document).ready(() => {
  app.onStart();
})