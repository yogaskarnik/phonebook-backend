const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('provide password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.9m8guuj.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Persons = mongoose.model('Persons', personSchema)

if (!name && !number) {
  Persons.find({}).then((result) => {
    result.map((person) => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Persons({
    name: name,
    number: number,
  })

  // eslint-disable-next-line no-unused-vars
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
