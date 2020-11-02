require('dotenv').config()
const app = require('express')
const http = require('http').createServer(app)
const port = (process.env.PORT || 4000)
// const mongoose = require('mongoose')
const io = require('socket.io')(http)
// mongoose.connect('mongodb://127.0.0.1/chatroom', {useNewUrlParser: true})


io.on('connection', (socket) => {
    socket.on('message', (message) => {
        io.emit('message', message)
    })
})

http.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})