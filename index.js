require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const errorHandler = require('./middlewares/errorHandler.js');
const Contact = require('./modules/contact.js');

const app = express();

const CONTACTS_ROUTE = '/api/contacts';

morgan.token('body', (req) =>
	req.method === 'POST' ? JSON.stringify(req.body) : ''
);

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get(CONTACTS_ROUTE, (req, res, next) => {
	Contact.find({}).then((contacts) => {
		res.status(200).json(contacts);
	}).catch((error) => next(error));
});

app.delete(`${CONTACTS_ROUTE}/:id`, (req, res, next) => {
	const contactId = req.params.id;

	Contact.findByIdAndDelete(contactId)
		.then((deletedDoc) => {
			console.log(deletedDoc)
			return deletedDoc ? res.status(204).end() : res.status(404).end();
		}).catch((error) => next(error));
});

app.get(`${CONTACTS_ROUTE}/:id`, (req, res, next) => {
	const contactId = req.params.id;

	Contact.findById(contactId)
		.then((contact) => {
			return contact ? res.status(200).json(contact) : res.status(404).end();
		}).catch((error) => next(error));
});

app.put(`${CONTACTS_ROUTE}/:id`, (req, res, next) => {
	const contactId = req.params.id;
	const { number: newNumber } = req.body;

	Contact.findById(contactId).then((contact) => {
		if (!contact) {
			return res.status(404).end();
		}

		contact.number = newNumber;
		contact.save().then((updatedContact) => {
			res.status(200).json(updatedContact);
		});
	}).catch((error) => next(error));
});

app.post(CONTACTS_ROUTE, async (req, res, next) => {
	const newContact = req.body;

	const isBadRequest = !newContact.name || !newContact.number;
	const isPersonAlreadyExist = await Contact.find({
		name: newContact.name,
	}).then((contacts) => !!contacts.length);

	if (isBadRequest || isPersonAlreadyExist) {
		const error = isPersonAlreadyExist
			? 'Name must be unique'
			: 'All fields are required';

		return res.status(400).json({ error });
	}

	new Contact(newContact).save().then((savedContact) => {
		res.status(201).json(savedContact);
	});
});

app.get('/api/info', (req, res) => {
	res
		.status(200)
		.send(
			`<p>Phonebook has info for ${
				persons.length
			} people</p><p>${new Date()}</p>`
		);
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);

console.log(`Server is running in port ${PORT}`);
