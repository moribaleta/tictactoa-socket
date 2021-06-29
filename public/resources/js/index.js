const app = new Vue({
  el: '#app',
  data: {
    username: "",
    users: [],
    socket: io(),
    connected: false,
    socket_id: null,
  },

  methods: {

    onStart() {
      this.socket.on("connect", () => {
        console.log("connected to the server")
        this.connected = true;
      })

      this.socket.on("socketid",(socket_id) => {
        console.log("socket id %o", socket_id)
        this.socket_id = socket_id
      })
      
      this.socket.on('disconnect', () => {
        console.log("disconnected from the server")
        this.connected = false
      })
      
      this.socket.on('onUserCreated', (message) => {
        console.log(message)
        if (message.error) {
          alert(message.error)
        } else {
          this.openGame(message.data)
        }
      })

      this.socket.on('lobbyUsers', (message) => {
        this.users = message.data || [];
      })

      let user = localStorage.getItem('user') || "{}"

      if (user != "{}") {
        let _user = JSON.parse(user)
        this.openGame(_user)
      }
    },

    openGame(user) {
      console.log(user)
      let _user = JSON.stringify(user)
      console.log(_user)
      localStorage.setItem('user', _user)
      window.open('lobby.html','_self')
    },

    onCreateUser() {
      if (this.username.length > 0) {
        /*this.socket.emit('createUser', {
          username: this.username
        })*/
        let object = {
          username: this.username,
          socket_id: this.socket_id,
        }

        $.post('/api/createUser', object)
          .then((message) => {
            this.openGame(message.data)
          }).catch((err) => {
            console.log(err)
          })

      } else {
        alert("you need a username")
      }
    },

  

  }
})

$(document).ready(() => {
  app.onStart();
})