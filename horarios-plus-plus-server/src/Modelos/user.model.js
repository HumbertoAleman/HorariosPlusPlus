import mongoose from "mongoose"
import Schedule from "./schedule.model.js"
const ObjectId = mongoose.Types.ObjectId

export default class User {
	static #schema = new mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		email: { type: String, require: true, unique: true },
		password: { type: String, require: true, unique: false },
		id: { type: String, require: true, unique: true },
		type: { type: String, require: true, unique: false },
		schedule: { type: mongoose.Schema.Types.ObjectId, require: false, unique: false, ref: "Schedule" }
	})

	static #model = mongoose.model("User", User.#schema)

	static findOne = async (id) => User.#model.findOne({ id: id })
	static findOneEmail = async (email) => User.#model.findOne({ email: email })
	static finyByIdAndUpdate = async (id, newData) =>
		await User.#model.findByIdAndUpdate(id, newData, { new: true })

	static finyByIdAndDelete = async (id) =>
		await User.#model.findByIdAndDelete(id)
	static findAndDelete = async (id) =>
		await User.#model.findOneAndDelete({ id: id })

	static checkIfExists = async (id) => User.#model.exists({ id: id })
	static checkIfIdExists = async (id) => User.#model.findById(id).then(res => res !== null && res !== undefined)

	static dropDb = async () => await mongoose.connection.collections.users.drop()


	// NOTE: CREATE
	static save = async (userType, userEmail, userPassword, userId) => {
		if (userEmail === undefined)
			return { message: "ERROR an unexpected error has occurred", code: 0 }
		if (userPassword === undefined)
			return { message: "ERROR userPassword cannot be undefined", code: 0 }
		if (userId === undefined)
			return { message: "ERROR userId cannot be undefined", code: 0 }
		if (await User.checkIfExists(userId))
			return { message: "ERROR a user with this id " + userId + " already exists", code: 0 }

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
				return { message: "ERROR userType cannot be undefined", code: 0 }
		}

		const createdUser = new User.#model({
			_id: new mongoose.mongo.ObjectId(),
			email: userEmail,
			password: userPassword,
			type: type,
			id: userId
		})
		const savedUser = await createdUser.save();

		return savedUser
	}

	static getById = async (id) => {
		if (id === undefined)
			return { message: "ERROR id cannot be undefined", code: 0 }

		const toFind = await User.findOne(id);
		if (toFind === null || toFind === undefined)
			return { message: "ERROR user with id " + id + " was not found", code: 0 }

		return toFind
	}

	static getByEmail = async (email) => {
		if (email === undefined)
			return { message: "ERROR email cannot be undefined", code: 0 }

		const toFind = await User.findOneEmail(email);
		if (toFind === null || toFind === undefined)
			return { message: "ERROR user with email " + email + " was not found", code: 0 }

		return toFind
	}

	static update = async (toUpdateId, newSchedule, newPassword, newEmail, newType) => {
		if (toUpdateId === undefined)
			return { message: "ERROR toUpdateId cannot be undefined" }

		const toUpdate = await User.findOne(toUpdateId);
		if (toUpdate === null || toUpdate === undefined)
			return { message: "ERROR user not found" }

		switch (newType) {
			case "alumno":
				newType = "alumno"
				break;
			case "profesor":
				newType = "profesor"
				break;
			case "organizador":
				newType = "organizador"
				break;
			case "admin":
				newType = "admin"
				break;
		}

		const updatedUser = await User.finyByIdAndUpdate(toUpdate._id, {
			email: newEmail ?? toUpdate.email,
			password: newPassword ?? toUpdate.password,
			scheduleId: new ObjectId(newSchedule ?? toUpdate.schedule),
			type: newType ?? toUpdate.type,
		})

		return updatedUser
	}

	static delete = async (toDeleteId) => {
		if (toDeleteId === undefined)
			return { message: "ERROR id cannot be undefined", code: 0 }

		const toDelete = await User.findAndDelete(toDeleteId);
		if (toDelete === null || toDelete === undefined)
			return { message: "ERROR user with id " + toDeleteId + " was not found", code: 0 }
		await Schedule.findByIdAndDelete(toDelete.schedule)

		return toDelete
	}
}
