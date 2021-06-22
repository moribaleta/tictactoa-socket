const app = new Vue({
    el: "#app",
    data: {
        user    : null,
        users   : [],
        session : new Session(),
        socket  : io(),
        connected : false,
        input_text: ""
    },
    methods: {

        onStart() {

            console.log("session %o", this.session)

            this.socket.on("connect", () => {
                console.log("connected to the server")
                this.connected = true;
            })

            this.socket.on('disconnect', () => {
                console.log("disconnected from the server")
                this.connected = false
            })

            this.socket.on('lobbyUsers', (message) => {
                this.users = [...message.data || []]
                console.log(this.users)
            })

            this.socket.on('onWinner', (message) => {
                alert(`Winner player: ${message.data}`)
            })

            this.socket.on('onSession', (message) => {
                console.log("session %o",message.data)
                this.session = {... Session.parse(message.data)}
            })

            let _user = localStorage.getItem('user') || "{}"

            if (_user != "{}") {
                this.user = User.parse(JSON.parse(_user))
                console.log("user %o", this.user)
            } else {
                window.open("index.html",'_self')
            }
        },

        toggleChat(isOpen){
          document.getElementById("sidebar").style.width = isOpen ? "350px" : "0";
        },

        getCurrPlayer(){

            console.log("session %o", this.session)
            if (!this.session) {
                return ""
            }

            let turn    = this.session.player_turn
            
            if (this.session.player_spec && turn) {
                console.log("player turn %o", turn)

                console.log("session player spec %o", this.session.player_spec)
            
                let player  = this.session.player_spec[turn]

                console.log("player%o", player)
                let name    = player ? player.username : ""
                
                
                return `Player ${turn} turn: ${name}`
            }
            return ""
        },

        onTossCoin() {

            console.log(this.session)
              /// 0 -> 1 , 0.5 * 2 = 0.9 = 1
            var x = (Math.floor(Math.random() * 2) == 0);
            if (x) {
                this.session.player_spec = {
                    1: this.users[0],
                    2: this.users[1]
                }
            } else {
                this.session.player_spec = {
                    1: this.users[1],
                    2: this.users[0]
                }
            }
            let player1 = this.session.player_spec[1]
            let player2 = this.session.player_spec[2]
            
            alert(`players\n player 1: ${player1.username} \n player 2: ${player2.username}`)
            console.log("on Toss COIN")
            this.session.state = GameState.create
            console.log("session %o", this.session)
            this.socket.emit('createSession', this.session)
        },

        onStartGame() {
            this.session.table = []

            for (var i = 0; i < this.session.table_size.row; i++) {
                var row = []
                for (var j = 0; j < this.session.table_size.col; j++) {
                    row.push(0)
                }
                this.session.table.push(row)
            }

            this.session.winner         = null
            this.session.player_turn    = 1

            this.session.state  = GameState.playing
            console.log("session %o", this.session)
            this.socket.emit('createSession', this.session)
        }, //onStart

        onFinish(result) {
            this.session.winner = result
            this.session.state  = GameState.finish
            this.onUpdateSession()
        }, //onFinish

        onSelect(row, col) {

            if (this.session.winner) {
                return
            }

            let curr_player = this.session.player_spec[this.session.player_turn]

            console.log("player %o %o %o",this.session.player_turn, curr_player)

            if (curr_player.id != this.user.id) {
                alert("waiting for the next player")
                return
            }


            if (this.session.table[row][col] > 0) {
                alert("Item already selected")
                return
            }

            var table = this.session.table
            table[row][col] = this.session.player_turn

            this.session.table = [...table]

            let result = this.checker()

            if (this.session.player_turn == 1) {
                this.session.player_turn = 2
            } else {
                this.session.player_turn = 1
            }

            if (result > 0) {
                this.onFinish(result)
            } else {
                this.onUpdateSession()
            }
        }, //onSelect

        onUpdateSession() {
            console.log("session %o", this.session)
            this.socket.emit('createSession', this.session)
        },

        onLogOut() {
            localStorage.setItem('user', '{}')
            this.socket.emit('removeUser', this.user)
            window.open("index.html",'_self')
        }, 

        checker() {
            const checker_value = this.session.player_turn // 1, 2
            const check_1 = 3 //1 * this.table_size.col
            const check_2 = 6 //2 * this.table_size.col

            const table = this.session.table

            for (var i = 0; i < table.length; i++) {

                console.log(" checking row " + i)
                var sum = 0

                ///for each column value
                for (var j = 0; j < table[i].length; j++) {
                    console.log(" checking column " + j)
                    if (table[i][j] == checker_value) {
                        sum += table[i][j]
                    }
                }

                console.log("sum = " + sum)

                if (check_1 == sum) {
                    console.log(" winner check1 ")
                    return 1
                } else if (check_2 == sum) {
                    console.log(" winner check2 ")
                    return 2
                }
            }

            var sum = 0

            //diagonal left - right
            for (var i = 0; i < table.length; i++) {
                let value = table[i][i]
                if (value == checker_value) {
                    sum += value
                }
            }

            if (check_1 == sum) {
                console.log(" winner check1 ")
                return 1
            } else if (check_2 == sum) {
                console.log(" winner check2 ")
                return 2
            }

            sum = 0

            //diagnonal right to left
            for (var i = 0, j = table.length - 1; i < table.length, j >= 0; i++, j--) {

                let value = table[i][j]
                console.log("diagonals: i:" + i + ", j:" + j + " value=" + value)

                if (value == checker_value) {
                    sum += value
                }
            }

            if (check_1 == sum) {
                console.log(" winner check1 ")
                return 1
            } else if (check_2 == sum) {
                console.log(" winner check2 ")
                return 2
            }

            // i: 0, 1, 2 - 2, 1, 0
            // j: 2, 1, 0 - 0, 1, 2

            // [1,0,0] -> 0,2 table[0][2] = 0
            // [0,2,0] -> 1,1 table[1][1] = 2
            // [1,0,0] -> 2,0 table[2][0] = 1

            // loop: 0, 1, 2
            // [1,0,0] -> 0,0 table[0][0] = 1
            // [0,2,0] -> 1,1 table[1][1] = 2
            // [1,0,0] -> 2,2 table[2][2] = 0

            // loop: 0, 1, 2
            // [1,0,0] -> 0,0 table[0][0] = 1
            // [0,2,0] -> 0,1 table[0][1] = 0
            // [1,0,0] -> 0,2 table[0][2] = 0


            ///CARLOS code------
            for (var i = 0; i < table[0].length; i++) { // <-- i for column
                sum = 0
                for (var j = 0; j < table.length; j++) { // <-- j for row
                    let value = table[j][i] //<--- value is either 0, 1, 2
                    if (checker_value == value) {
                        sum += value
                    }
                }

                if (check_1 == sum) {
                    console.log(" winner check1 ")
                    return 1
                } else if (check_2 == sum) {
                    console.log(" winner check2 ")
                    return 2
                }

            }

            ///----------------



            return 0

        }, //checker
        sendmessage(){
          let text = this.input_text
          let message = new UserMessage()
          message.message = text
          message.user_id = this.user.id
          this.session.chat.push(message)
          this.onUpdateSession()
          this.input_text = ""

        },
        getuser(id){
          let user = this.users.find((user) => {
            return user.id = id
          })
            return user
        }
      

    }

}) //app


$(document).ready(() => {
    app.onStart();
})