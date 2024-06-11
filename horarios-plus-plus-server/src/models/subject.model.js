import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId

export default class Subject {
	static #schema = new mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		name: { type: String, require: true, unique: true },
		sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
	})

	static #model = mongoose.model("Subject", Subject.#schema)

	static find = async (name) => await Subject.#model.find({ name: name })
	static findOne = async (name) => await Subject.#model.findOne({ name: name })
	static findAndUpdate = async (oldName, newName) => await Subject.#model.findOneAndUpdate({ name: oldName }, { name: newName }, { new: true })
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

		return { message: "ERROR saving section", code: 0 }
	}

	// NOTE: READ
	static get = async (name) => {
		if (name === undefined)
			return []
		return await Subject.findOne(name)
	}

	static update = async (oldName, newName) => {
		if (oldName === undefined)
			return { message: "ERROR oldName is undefined", code: 0 }
		if (newName === undefined)
			return { message: "ERROR newName is undefined", code: 0 }

		const updatedSubject = await Subject.findAndUpdate(oldName,newName)
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
			await SectionController.deleteSection({ query: { id: sectionId } })

		return deletedData
	}
}
