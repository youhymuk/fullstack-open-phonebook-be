require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Contact = require('./modules/contact.js');

const app = express();

const CONTACTS_ROUTE = '/api/contacts';

morgan.token('body', (req) =>
	req.method === 'POST' ? JSON.stringify(req.body) : ''
);

app.use(
	express.json(),
	morgan(':method :url :status :res[content-length] - :response-time ms :body'),
	cors(),
	express.static('dist')
);

app.get(CONTACTS_ROUTE, (req, res) => {
	Contact.find({}).then((contacts) => {
		res.status(200).json(contacts);
	});
});

app.delete(`${CONTACTS_ROUTE}/:id`, (req, res) => {
	const contactId = req.params.id;

	Contact.findByIdAndDelete(contactId).then(() => {
		res.status(204).end();
	});
});

app.get(`${CONTACTS_ROUTE}/:id`, (req, res) => {
	const contactId = req.params.id;

	Contact.findById(contactId)
		.then((contact) => {
			res.status(200).json(contact);
		})
		.catch(() => res.status(404).end());
});

app.post(CONTACTS_ROUTE, async (req, res) => {
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

const PORT = process.env.PORT;
app.listen(PORT);

console.log(`Server is running in port ${PORT}`);
