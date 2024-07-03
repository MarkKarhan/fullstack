const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
let notes = [
  {
    content : "note1",
    important : false,
    id : 1
  },
  {
    content : "note2",
    important : false,
    id : 2
  },
  {
    content : "note3",
    important : false,
    id : 3
  }
]  

app.use(morgan(function (tokens, req, res) {
  console.log(tokens.method)
  if (tokens.method(req, res) == 'POST'){
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }
}))

app.use(express.json())
// app.use(morgan('dev'))
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.get('/', (request, response) => {
  response.send("<h1> Home  </h1>")
})

app.get('/api/persons', (request, response) => {
  response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => id === note.id)
  if (note){
    response.json(note)
  }
  else{
    response.status(404).end()
  }
})

app.get('/api/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${notes.length} people</p><p>${new Date()}</p>`)
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end
})

app.post('/api/persons', (request, response) => {
  const id = Math.trunc(Math.random()*1000)
  const body = request.body 
  if (!body.content){
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  if (checkDuplicate(body.content)) {
    return response.status(400).json({ 
      error: 'duplicate entry' 
    })
  }
  const newNote = {
    content : body.content,
    important : body.important,
    id : id
  }
  notes = notes.concat(newNote)
  response.json(notes)
})
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running  on port ${PORT}`)
})

const checkDuplicate = (name) => {
  const names = notes.map(note => note = note.content)
  if (names.find(note => note == name)) {
    return true
  }
}

app.use(unknownEndpoint)

