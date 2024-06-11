import mongoose from "mongoose"
import Subject from "../../models/subject.model.js"
import SectionController from "../section/SectionController.js"

class SubjectController {
	// NOTE: CREATE
	static async newSubject(req, res) {
		const subjectName = req?.query?.name
		const subjectCareers = req?.query?.careerNames

		if (await Subject.exists({ name: subjectName }).then(res => res !== null)) {
			res?.send({ message: "ERROR cannot add duplicate names", code: 0 })
			return { message: "ERROR cannot add duplicate names", code: 0 }
		}

		const subjectCount = await Subject.find().countDocuments() ?? 0
		const newSubject = new Subject({
			_id: new mongoose.mongo.ObjectId,
			name: (subjectName || null) ?? ("New Subject " + subjectCount),
			sections: [],
			careers: subjectCareers?.split(',') ?? [],
		})

		const savedSubject = await newSubject.save()
		if (savedSubject !== newSubject) {
			// This error should never occur
			res?.send({ message: "ERROR saving section", code: 0 })
			return { message: "ERROR saving section", code: 0 }
		}

		res?.send(newSubject)
		return newSubject
	}

	// NOTE: READ
	static async getsubjects(_, res) {
		const foundsubject = await Subject.find()
		if (foundsubject === undefined || foundsubject === null) {
			res?.send([])
			return []
		}

		res?.send(foundsubject)
		return foundsubject
	}

	static async getSubject(req, res) {
		const subjectName = req?.query?.name

		if (subjectName === undefined) {
			res?.send({ message: "ERROR subjectName is undefined", code: 0 })
			return { message: "ERROR subjectName is undefined", code: 0 }
		}

		const foundSubject = await Subject.findOne({ name: subjectName })
		if (foundSubject === undefined || foundSubject === null) {
			res?.send({ message: "ERROR subject with name " + subjectName + " was not found", code: 0 })
			return { message: "ERROR subject with name " + subjectName + " was not found", code: 0 }
		}

		res?.send(foundSubject)
		return foundSubject
	}


	// NOTE: UPDATE
	static async updateSubject(req, res) {
		const oldName = req?.query?.oldName
		const newName = req?.query?.newName

		if (oldName === undefined) {
			res?.send({ message: "ERROR oldName is undefined", code: 0 })
			return { message: "ERROR oldName is undefined", code: 0 }
		}

		if (newName === undefined) {
			res?.send({ message: "ERROR newName is undefined", code: 0 })
			return { message: "ERROR newName is undefined", code: 0 }
		}

		const updatedSubject = await Subject.findOneAndUpdate({ name: oldName }, { name: newName }, { new: true })
		// the new option returns the documents new version
		if (updatedSubject === undefined || updatedSubject === null) {
			res?.send({ message: "ERROR subject with name " + oldName + " was not found", code: 0 })
			return { message: "ERROR subject with name " + oldName + " was not found", code: 0 }
		}

		res?.send(updatedSubject)
		return updatedSubject
	}


	// NOTE: DELETE
	static async deleteSubject(req, res) {
		const subjectName = req?.query?.name

		if (subjectName === undefined) {
			res?.send({ message: "ERROR subjectName is undefined", code: 0 })
			return { message: "ERROR subjectName is undefined", code: 0 }
		}

		if (await Subject.exists({ name: subjectName }) === null) {
			res?.send({ message: "ERROR subject does not exist", code: 0 })
			return { message: "ERROR subject does not exist", code: 0 }
		}

		const deletedData = await Subject.findOneAndDelete({ name: subjectName })
		if (deletedData === undefined) {
			// This error should never happen
			res?.send({ message: "ERROR an unexpected error has occured", code: 0 })
			return { message: "ERROR an unexpected error has occured", code: 0 }
		}

		for (const sectionId of deletedData.sections) {
			await SectionController.deleteSection({ query: { id: sectionId } })
		}

		res?.send(deletedData)
		return deletedData
	}
}
