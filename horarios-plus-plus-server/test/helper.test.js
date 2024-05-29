import mongoose from 'mongoose'

mongoose.Promise = global.Promise
const MONGODB_URI = 'mongodb+srv://humberto:cocosete@serverdata.64ryvhh.mongodb.net/?retryWrites=true&w=majority&appName=serverdata'
mongoose.connect(MONGODB_URI)

mongoose.connection
    .once('open', () => console.log('Connected for testing!'))
    .on('error', (error) => {
        console.warn('Error: ', error)
    })

beforeEach(async () => {
    await mongoose.connection.collections.subjects.drop()
    await mongoose.connection.collections.sections.drop()
    await mongoose.connection.collections.sessions.drop()
    await mongoose.connection.collections.events.drop()
})

after(() => {
    mongoose.connection.collections.subjects.drop()
    mongoose.connection.collections.sections.drop()
    mongoose.connection.collections.sessions.drop()
    mongoose.connection.collections.events.drop()
})
