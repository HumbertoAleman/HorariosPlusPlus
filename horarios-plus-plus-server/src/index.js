import express from 'express';
import cors from "cors"
import mongoose from 'mongoose';

import Router from './Rutas/router.js';

const app = express()
const port = 4000

const uri = "mongodb+srv://humberto:cocosete@serverdata.64ryvhh.mongodb.net/?retryWrites=true&w=majority&appName=serverdata";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
	await mongoose.connect(uri, clientOptions);
	await mongoose.connection.db.admin().command({ ping: 1 });
	console.log("Successfully connected to MongoDB");
}

run().catch(console.dir);

let corsOptions = { origin: "*", }
app.use(cors(corsOptions))
Router.routeToApp(app)

app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})

