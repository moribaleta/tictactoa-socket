const app = new Vue({
  el: '#app',
  data: {
    username: "",
    users: [],
    socket: io(),
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
      window.open('game.html','_self')
    },

    onCreateUser() {
      if (this.username.length > 0) {
        this.socket.emit('createUser', {
          username: this.username
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