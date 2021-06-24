const app = new Vue({
  el: '#app',
  data: {
    username: "",
    user: {},
    users: [],
    sessions: [],
    socket: io(),
    session_input : {},
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

      let _user = localStorage.getItem('user') || "{}"
      console.log(_user)
      if (_user != "{}") {
          this.user = User.parse(JSON.parse(_user))
          console.log("user %o", this.user)
          this.fetchData()
      } else {
          window.open("index.html",'_self')
      }
    },

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
        this.sessions = res.sessions
      }).catch((err) => {
        console.log(err)
      })
    },

    openGame(user) {
      console.log(user)
      let _user = JSON.stringify(user)
      console.log(_user)
      localStorage.setItem('user', _user)
      window.open('lobby.html','_self')
    },

    onCreateGame(){
      $('#newGameModal').modal()
      this.session_input = new Session()
    },

    onSaveGame(){
      
      this.session_input.players.push(this.user.id)

      let object = {
        user_id : this.user.id,
        session : this.session_input.toObject()
      }

      $.post('/api/createSession', object)
        .then((res) => {
          console.log(res)
          window.open('game.html','_self')
        }).catch((err) => {
          console.log(err)
        })
    }
  

  }
})

$(document).ready(() => {
  app.onStart();
})