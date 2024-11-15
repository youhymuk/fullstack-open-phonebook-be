const express = require('express');

const app = express();

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

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (req, res) => {
  res.status(200).json(persons);
});

app.delete('/api/persons/:id', (req, res) => {
  const personId = req.params.id;

  persons = persons.filter(({ id }) => id !== personId);

  res.status(204).end();
});

app.get('/api/persons/:id', (req, res) => {
  const personId = req.params.id;

  const person = persons.find(({ id }) => id === personId);

  if (person) res.status(200).json(person);
  else res.status(404).send("Person wasn't found");
});

app.get('/api/info', (req, res) => {
  res.status(200).send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

const PORT = 3001;
app.listen(PORT);

console.log(`Server is running in port ${PORT}`);
