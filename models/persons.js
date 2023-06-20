const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(() => {
    console.log('error connecting to MongoDB')
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 11,
    validate: {
      validator: (v) => {
        return /(\d{2}|\d{3})-\d+/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
    required: [true, 'User phone number is required'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Persons', personSchema)
