import mongoose from "mongoose"
import Section from "./section.model.js"
const ObjectId = mongoose.Types.ObjectId

export default class Subject {
	static #schema = new mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		name: { type: String, require: true, unique: true },
		sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
	})

	static #model = mongoose.model("Subject", Subject.#schema)

	static find = async (name) => await Subject.#model.find({ name: name })
	static getAll = async () => await Subject.#model.find()
	static findOne = async (name) => await Subject.#model.findOne({ name: name })
	static findById = async (id) => await Subject.#model.findById(id)

	static findAndUpdate = async (oldName, newName) => await Subject.#model.findOneAndUpdate({ name: oldName }, { name: newName }, { new: true })

	static byIdAddSection = async (subjectId, sectionId) =>
		await Subject.#model.findByIdAndUpdate(
			subjectId, {
			sections: await Subject.findOne(subjectName).then(res =>
				res.sections.concat(new ObjectId(sectionId)))
		})

	static byNameAddSection = async (subjectName, sectionId) =>
		await Subject.#model.findOneAndUpdate(
			{ name: subjectName }, {
			sections: await Subject.findOne(subjectName).then(res =>
				res.sections.concat(new ObjectId(sectionId)))
		})

	static byIdRemoveSection = async (subjectId, sectionId) =>
		await Subject.#model.findByIdAndUpdate(
			subjectId, {
			sections: await Subject.findById(subjectId).then(res =>
				res.sections.filter(otherId => !otherId.equals(sectionId)))
		})

	static byNameRemoveSection = async (subjectName, sectionId) =>
		await Subject.#model.findOneAndUpdate(
			{ name: subjectName }, {
			sections: await Subject.findOne(subjectName).then(res =>
				res.sections.filter(otherId => !otherId.equals(sectionId)))
		})

	static hasSection = async (subjectId, sectionId) =>
		await Subject.findById(subjectId).then(res => res.sections.some(id => id.equals(sectionId)))

	static findAndDelete = async (name) => await Subject.#model.findOneAndDelete({ name: name })
	static dropDb = async () => await mongoose.connection.collections.subjects.drop()
	static countSubjects = async () => await Subject.#model.find().countDocuments() + 1 ?? 1
	static checkIfExists = async (name) => await Subject.#model.exists({ name: name }).then(res => res !== null)

	// NOTE: CREATE
	static save = async (name, sections) => {
		if (name === undefined)
			name = "Subject " + await Subject.countSubjects()
		else
			name = name

		if (sections === undefined)
			sections = []
		sections = sections

		if (await Subject.checkIfExists(name))
			return { message: "ERROR cannot add duplicate names", code: 0 }

		const createdUser = new Subject.#model({
			_id: new ObjectId(),
			name: name,
			sections: sections
		})
		const savedUser = await createdUser.save();

		if (await Subject.checkIfExists(createdUser.name))
			return savedUser

		return { message: "ERROR saving subject", code: 0 }
	}

	// NOTE: READ
	static get = async (name) => {
		if (name === undefined)
			return await Subject.getAll()
		return await Subject.findOne(name)
	}

	static update = async (oldName, newName) => {
		if (oldName === undefined)
			return { message: "ERROR oldName is undefined", code: 0 }
		if (newName === undefined)
			return { message: "ERROR newName is undefined", code: 0 }

		const updatedSubject = await Subject.findAndUpdate(oldName, newName)
		if (updatedSubject === undefined || updatedSubject === null)
			return { message: "ERROR subject with name " + oldName + " was not found", code: 0 }
		return updatedSubject
	}

	// NOTE: DELETE
	static delete = async (name) => {
		if (name === undefined)
			return { message: "ERROR name is undefined", code: 0 }
		if (await Subject.checkIfExists(name))
			return { message: "ERROR subject does not exist", code: 0 }

		const deletedData = await Subject.findAndDelete(name)
		if (deletedData === undefined)
			return { message: "ERROR an error has occurred deleting the subject", code: 0 }

		for (const sectionId of deletedData.sections)
			await Section.deleteById(sectionId)

		return deletedData
	}
}
