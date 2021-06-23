const app = new Vue({
  el: '#app',
  data: {
    username: "",
    user: {},
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