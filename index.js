const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

morgan.token('post-params', (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-params'
  )
);
app.use(cors());
app.use(express.static('build'));

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

//Handle no resourse
app.get('/', (request, response) => {
  response.sendStatus(404).end();
});

//Display all persons
app.get('/api/persons', (request, response) => {
  response.send(persons);
});

//Display person info
app.get('/info', (request, response) => {
  const info = {
    noOfPersons: `Phonebook has info for ${persons.length} people`,
    timeOfProcessing: Date(),
  };
  const infoToSend = `<p>${info.noOfPersons}<br/><br/>${info.timeOfProcessing}</p>`;
  response.send(infoToSend).end();
});

//Get person with id
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.send(person);
  } else {
    response.sendStatus(404).end();
  }
});

//Delete person with id
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end;
});

const generateId = () => {
  const maxId = Math.round(Math.random() * 1000);
  return maxId + 1;
};

//Create new person
app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    response.status(400).json({
      error: `${!body.name ? 'name' : 'number'} must be provided`,
    });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number || 12345678,
  };

  const duplicate = persons.find((person) => person.name === newPerson.name);
  if (duplicate) {
    response.status(400).json({ error: 'name must be unique' });
  }

  persons = persons.concat(newPerson);
  response.json(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
