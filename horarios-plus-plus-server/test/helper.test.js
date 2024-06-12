import mongoose from 'mongoose'
import Subject from '../src/models/subject.model.js'
import Section from '../src/models/section.model.js'
import Session from '../src/models/session.model.js'
import User from '../src/models/user.model.js'

mongoose.Promise = global.Promise
const MONGODB_URI = 'mongodb+srv://humberto:cocosete@serverdata.64ryvhh.mongodb.net/?retryWrites=true&w=majority&appName=serverdata'
mongoose.connect(MONGODB_URI)

mongoose.connection
    .once('open', () => console.log('Connected for testing!'))
    .on('error', (error) => {
        console.warn('Error: ', error)
    })

beforeEach(async () => {
	await Subject.dropDb()
	await Section.dropDb()
	await Session.dropDb()
	await User.dropDb()
})

after(() => {
	Subject.dropDb()
	Section.dropDb()
	Session.dropDb()
	User.dropDb()
})
