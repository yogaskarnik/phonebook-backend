require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Persons = require('./models/persons')

// eslint-disable-next-line no-unused-vars
morgan.token('post-params', (req, res) => {
  return JSON.stringify(req.body)
})

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Hostname:', request.headers.host)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.static('build'))

//Display all persons
app.get('/api/persons', (req, res) => {
  Persons.find({}).then((result) => {
    res.json(result)
  })
})

//Display person info
app.get('/info', (req, res) => {
  Persons.find({}).then((result) => {
    const info = {
      noOfPersons: `Phonebook has info for ${result.length} people`,
      timeOfProcessing: Date(),
    }
    const infoToSend = `<p>${info.noOfPersons}<br/><br/>${info.timeOfProcessing}</p>`
    res.send(infoToSend)
  })
})

//Get person with id
app.get('/api/persons/:id', (req, res, next) => {
  Persons.findById(req.params.id)
    .then((person) => {
      res.json(person)
    })
    .catch((error) => next(error))
})

//Delete person with id
app.delete('/api/persons/:id', (req, res, next) => {
  Persons.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error))
})

//Create new person
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const newPerson = new Persons({
    name: body.name,
    number: body.number,
  })

  newPerson
    .save()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => next(error))
})

//Update person with id
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Persons.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((udpatedPerson) => {
      response.json(udpatedPerson)
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
