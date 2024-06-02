import User from "../../models/user.model.js"
import mongoose from "mongoose"

export default async function newUser(req, res) {
	const userEmail = req?.query?.email
	const userPassword = req?.query?.password
	const userId = req?.query?.id

	if (userEmail === undefined) {
		res?.send({ message: "ERROR userEmail cannot be undefined", code: 0 })
		return { message: "ERROR an unexpected error has occurred", code: 0 }
	}

	if (userPassword === undefined) {
		res?.send({ message: "ERROR userPassword cannot be undefined", code: 0 })
		return { message: "ERROR userPassword cannot be undefined", code: 0 }
	}

	if (userId === undefined) {
		res?.send({ message: "ERROR userId cannot be undefined", code: 0 })
		return { message: "ERROR userId cannot be undefined", code: 0 }
	}
	
	const createdUser = new User({
		_id: new mongoose.mongo.ObjectId(),
		email: userEmail,
		password: userPassword,
		id: userId
	})
	const savedUser = await createdUser.save();
	
	res?.send(savedUser)
	return savedUser
}
