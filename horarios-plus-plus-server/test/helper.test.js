import mongoose from 'mongoose'

mongoose.Promise = global.Promise
const MONGODB_URI = 'mongodb+srv://humberto:cocosete@serverdata.64ryvhh.mongodb.net/?retryWrites=true&w=majority&appName=serverdata'
mongoose.connect(MONGODB_URI)

mongoose.connection
    .once('open', () => console.log('Connected for testing!'))
    .on('error', (error) => {
        console.warn('Error: ', error)
    })

beforeEach(() => {
    mongoose.connection.collections.subjects.drop((err) => {
        console.log("Subjects dropped")
    })
})