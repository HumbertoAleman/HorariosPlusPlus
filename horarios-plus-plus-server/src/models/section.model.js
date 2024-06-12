import mongoose from "mongoose"
import Subject from "./subject.model.js"
import SessionController from "../routes/session/SessionController.js"
import Schedule from "./schedule.model.js"
const ObjectId = mongoose.Types.ObjectId

export default class Section {
	static #schema = new mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		nrc: { type: Number, require: true, unique: true },
		teacher: { type: String, require: true, unique: false },
		sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
		subject: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "Subject" }
	})

	static #model = mongoose.model("Section", Section.#schema)

	static find = async (nrc) => await Section.#model.find({ nrc: nrc })
	static findOne = async (nrc) => await Section.#model.findOne({ nrc: nrc })
	static findById = async (id) => await Section.#model.findById(id)

	static findAndUpdate = async (oldNrc, newData) =>
		await Section.#model.findOneAndUpdate(
			{ nrc: oldNrc }, newData, { new: true })

	static findAndDelete = async (nrc) =>
		await Section.#model.findOneAndDelete({ nrc: nrc })
	static findByIdAndDelete = async (id) =>
		await Section.#model.findByIdAndDelete(id)

	static countSections = async () => await Section.#model.find().countDocuments() + 1 ?? 1
	static checkIfExists = async (nrc) => await Section.#model.exists({ nrc: nrc })
	static checkIfIdExists = async (id) => await Section.#model.findById(id).then(res => res !== null)

	static byIdAddSession = async (sectionId, sessionId) =>
		await Section.#model.findByIdAndUpdate(
			sectionId, {
			sessions: await Section.findById(sectionId).then(res =>
				res.sessions.concat(new ObjectId(sessionId)))
		}, { new: true })

	static byNrcAddSession = async (sectionNrc, sessionId) =>
		await Section.#model.findOneAndUpdate(
			{ name: sectionNrc }, {
			sessions: await Section.findOne(sectionNrc).then(res =>
				res.sessions.concat(new ObjectId(sessionId)))
		}, { new: true })

	static byIdRemoveSession = async (sectionId, sessionId) =>
		await Section.#model.findByIdAndUpdate(
			sectionId, {
			sessions: await Section.findById(sectionId).then(res =>
				res.sessions.filter(otherId => !otherId.equals(sessionId)))
		}, { new: true })

	static byNrcRemoveSession = async (sectionNrc, sessionId) =>
		await Section.#model.findOneAndUpdate(
			{ name: sectionNrc }, {
			sessions: await Section.findOne(sectionNrc).then(res =>
				res.sessions.filter(otherId => !otherId.equals(sessionId)))
		}, { new: true })

	static dropDb = async () => await mongoose.connection.collections.sections.drop()

	// NOTE: CREATE
	static save = async (nrc, teacher, sessions, subject) => {
		if (subject === undefined)
			return { message: "ERROR subject is undefined", code: 0 }
		if (await Subject.checkIfExists(subject).then(res => !res))
			return { message: "ERROR Subject does not exist", code: 0 }

		if (await Section.checkIfExists(nrc))
			return { message: "ERROR nrc already exists", code: 0 }

		const newSection = new Section.#model({
			_id: new ObjectId(),
			nrc: nrc ?? await Section.countSections().then(res => parseInt(res)),
			teacher: teacher ?? "Por Asignar",
			sessions: sessions?.split(',') ?? [],
			subject: await Subject.findOne(subject).then(res => new ObjectId(res._id))
		})
		const createdSection = await newSection.save()

		if (await Section.checkIfExists(createdSection.nrc)) {
			await Subject.byNameAddSection(subject, createdSection._id)
			return createdSection
		}

		return { message: "ERROR saving section", code: 0 }
	}


	// NOTE: READ
	static getFromSubject = async (subjectId) => {
		if (nrc === undefined)
			return []
		const sections = []
		for (const sectionId of await Subject.findById(subjectId).then(res => res.sections))
			sections.push(await Section.findById(sectionId))
	}

	static getByNrc = async (nrc) => {
		if (nrc === undefined)
			return { message: "ERROR section with nrc " + nrc + " was not found", code: 0 }
		return await Section.findOne(nrc)
	}

	static getById = async (id) => {
		if (id === undefined)
			return { message: "ERROR section with id " + id + " was not found", code: 0 }
		return await Section.findById(id)
	}

	// NOTE: UPDATE
	static update = async (oldNrc, newNrc, newTeacher) => {
		const newData = {}

		if (oldNrc === undefined)
			return { message: "ERROR oldNrc is undefined", code: 0 }
		if (await Section.checkIfExists(oldNrc).then(res => !res))
			return { message: "ERROR section with nrc " + oldNrc + " was not found", code: 0 }

		if (newNrc !== undefined)
			newData.nrc = newNrc
		if (newTeacher !== undefined)
			newData.teacher = newTeacher

		const updatedSection = await Section.findAndUpdate(oldNrc, newData)
		if (updatedSection === undefined || updatedSection === null)
			return { message: "ERROR section with nrc " + oldNrc + " was not found", code: 0 }
		return updatedSection
	}

	// NOTE: DELETE
	static #editAffected = async (sectionObject) => {
		Subject.byIdRemoveSection(sectionObject.subject, deletedData._id)
		for (const sessionId of sectionObject.sessions)
			await SessionController.deleteSession({ query: { id: sessionId } })
		await Schedule.deleteMany({ sections: sectionObject._id })
	}

	static delete = async (nrc) => {
		if (nrc === undefined)
			return { message: "ERROR nrc is undefined", code: 0 }
		if (await Section.checkIfExists(nrc).then(res => !res))
			return { message: "ERROR there is no section with nrc " + nrc, code: 0 }

		const deletedData = await Section.findAndDelete(nrc)
		if (deletedData === undefined)
			return { message: "ERROR an error has occurred deleting the section", code: 0 }

		Section.#editAffected(deletedData)

		return deletedData
	}

	static deleteById = async (id) => {
		if (id === undefined)
			return { message: "ERROR id is undefined", code: 0 }

		if (await Section.checkIfIdExists(id).then(res => !res))
			return { message: "ERROR there is no section with id " + id, code: 0 }

		const deletedData = await Section.findByIdAndDelete(nrc)
		if (deletedData === undefined)
			return { message: "ERROR an error has occurred deleting the section", code: 0 }

		Section.#editAffected(deletedData)

		return deletedData
	}
}

