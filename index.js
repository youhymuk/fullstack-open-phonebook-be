const express = require('express');
const morgan = require('morgan');

const app = express();

const PERSONS_ROUTE = '/api/persons';

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.use(express.json(), morgan('tiny'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get(PERSONS_ROUTE, (req, res) => {
  res.status(200).json(persons);
});

app.delete(`${PERSONS_ROUTE}/:id`, (req, res) => {
  const personId = req.params.id;

  persons = persons.filter(({ id }) => id !== personId);

  res.status(204).end();
});

app.get(`${PERSONS_ROUTE}/:id`, (req, res) => {
  const personId = req.params.id;

  const person = persons.find(({ id }) => id === personId);

  if (person) res.status(200).json(person);
  else res.status(404).json({ error: "Person wasn't found" });
});

app.post(PERSONS_ROUTE, (req, res) => {
  const newPerson = req.body;

  const isPersonAlreadyExist = persons.findIndex(({ name }) => name === newPerson.name) !== -1;
  const isBadRequest = !newPerson.name || !newPerson.number || isPersonAlreadyExist;

  console.log(isPersonAlreadyExist, isBadRequest);

  if (isBadRequest) {
    const error = isPersonAlreadyExist ? 'Name must be unique' : 'All fields are required';

    res.status(400).json({ error });

    return;
  }

  const newPersonId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + (persons.length + 1);

  persons = [...persons, { id: newPersonId, ...req.body }];

  res.status(200).json(persons);
});

app.get('/api/info', (req, res) => {
  res.status(200).send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

const PORT = 3001;
app.listen(PORT);

console.log(`Server is running in port ${PORT}`);
