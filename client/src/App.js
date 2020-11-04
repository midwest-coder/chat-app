import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import Paper from '@material-ui/core/Paper'
import './App.css'
import { Button, Grid } from '@material-ui/core'

const socket = io.connect('http://localhost:4000')

function App() {
  const [message, setMessage] = useState({username: '', text: '' })
  const [chat, setChat] = useState([])

  useEffect(() => {
    socket.on('message', (_message) => {
      setChat([ ...chat, { _message } ])
    })
  })

  const onTextChange = (e) => {
    setMessage({ ...message, [e.target.name]: e.target.value } )
  }

  const renderChat = () => {
    return chat.map(({ _message }, index) => (
      <div key={index}>
        <h3>{_message.username}: <span>{_message.text}</span></h3>
      </div>
      )
    )
  }

  const onMessageSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', message)
    setMessage({username: '', text: ''})
  }

  return (
    <div className="App">
      <Grid container>
        <Grid item xs={6}>
        <h5>Messenger</h5>
      <Paper>
        <h4>Chat</h4>
        {renderChat()}
      </Paper>
        </Grid>
        <Grid item xs={6}>
          <Card>
              <form onSubmit={onMessageSubmit}>
                  <TextField name="username" onChange={e => onTextChange(e)} value={message.username} label="Username"/>
                  <TextField name="text" onChange={e => onTextChange(e)} value={message.text} label="Message" variant="outlined"/>
                  <Button type="submit">Send</Button>
              </form>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
