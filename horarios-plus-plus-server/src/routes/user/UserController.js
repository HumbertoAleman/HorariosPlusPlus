import mongoose from "mongoose"
import User from "../../models/user.model.js"

export default class UserController {
	// NOTE: CREATE
	static async newUser(req, res) {
		const userType = req?.query?.type
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

		let type
		switch (userType) {
			case "alumno":
				type = "alumno"
				break;
			case "profesor":
				type = "profesor"
				break;
			case "organizador":
				type = "organizador"
				break;
			case "admin":
				type = "admin"
				break;
			default:
				res?.send({ message: "ERROR userType cannot be undefined", code: 0 })
				return { message: "ERROR userType cannot be undefined", code: 0 }
		}

		const createdUser = new User({
			_id: new mongoose.mongo.ObjectId(),
			email: userEmail,
			password: userPassword,
			type: type,
			id: userId
		})
		const savedUser = await createdUser.save();

		res?.send(savedUser)
		return savedUser
	}

	// NOTE: READ
	static async getUser(req, res) {
		const toFindEmail = req?.query?.email
		const toFindId = req?.query?.id

		if (toFindId === undefined && toFindEmail === undefined) {
			res?.send({ message: "ERROR both toFindId and toFindEmail cannot be undefined" })
			return { message: "ERROR both toFindId and toFindEmail cannot be undefined" }
		}

		const filter = {}
		if (toFindEmail !== undefined)
			filter.email = toFindEmail
		if (toFindEmail !== undefined)
			filter.id = toFindId

		const toFind = await User.findOne(filter);
		if (toFind === null || toFind === undefined) {
			res?.send({ message: "ERROR user not found" })
			return { message: "ERROR user not found" }
		}

		res?.send(toFind)
		return toFind
	}

	static async getUser(req, res) {
		const toUpdateEmail = req?.query?.email
		const toUpdateId = req?.query?.id
		const newSchedule = req?.query?.scheduleId
		const newPassword = req?.query?.password

		if (toUpdateId === undefined && toFindEmail === undefined) {
			res?.send({ message: "ERROR both toUpdateId and toFindEmail cannot be undefined" })
			return { message: "ERROR both toUpdateId and toFindEmail cannot be undefined" }
		}

		const filter = {}
		if (toUpdateEmail !== undefined)
			filter.email = toUpdateEmail
		if (toUpdateEmail !== undefined)
			filter.id = toUpdateId

		const toUpdate = await User.findOne(filter);
		if (toUpdate === null || toFind === undefined) {
			res?.send({ message: "ERROR user not found" })
			return { message: "ERROR user not found" }
		}

		await User.findOneAndUpdate(filter, {
			password: newPassword,
			scheduleId: new mongoose.mongo.ObjectId(newSchedule)
		})

		res?.send(toUpdate)
		return toUpdate
	}

	// NOTE: DELETE
	static async deleteUser(req, res) {
		const toDeleteEmail = req?.query?.email
		const toDeleteId = req?.query?.id

		if (toDeleteId === undefined && toDeleteEmail === undefined) {
			res?.send({ message: "ERROR both toDeleteId and toDeleteEmail cannot be undefined" })
			return { message: "ERROR both toDeleteId and toDeleteEmail cannot be undefined" }
		}

		const filter = {}
		if (toDeleteEmail !== undefined)
			filter.email = toDeleteEmail
		if (toDeleteEmail !== undefined)
			filter.id = toDeleteId

		const toDelete = await User.findOne(filter);
		if (toDelete === null || toDelete === undefined) {
			res?.send({ message: "ERROR user not found" })
			return { message: "ERROR user not found" }
		}

		const deletedUser = await User.findByIdAndDelete(toDelete._id)

		res?.send(deletedUser)
		return deletedUser
	}
}
