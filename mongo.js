const mongoose = require('mongoose');

const [, , password, newContactName, newContactNumber] = process.argv;

if (!password) {
  console.log('Provide password as an argument');
  process.exit(1);
}

const url = `mongodb+srv://youhymuk:${password}@cluster0.vsjoy.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url).catch((error) => console.log(error));

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model('Contact', contactSchema);

if (newContactName && newContactNumber) {
  const contact = new Contact({ name: newContactName, number: newContactNumber });
  contact.save().then(({ name, number }) => {
    console.log(`added ${name} ${number} to the phonebook`);
    mongoose.connection.close();
  });
} else {
  Contact.find().then((contacts) => {
    const contactsToShow = contacts.map(({ name, number }) => `${name} ${number}`).join('\n');
    console.log(`phonebook:\n${contactsToShow}`);
    mongoose.connection.close();
  });
}
