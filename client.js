// const WebSocket = require('ws')
// const url = ['ws://localhost:9999', 'ws://18.139.12.132:9999']
// const connection = new WebSocket(url[0])

// connection.addEventListener('reserv', function (event) {
//     connection.send('Client: I got payload')
//     console.log(event.data)
// })

// connection.onopen = () => {
//     connection.send('Message From Client')
// }

// connection.onerror = (error) => {
//     console.log(`WebSocket error: ${JSON.stringify(error)}`)
// }

// connection.onmessage = (e) => {
//     console.log("onmessage: " + e.data)
// }