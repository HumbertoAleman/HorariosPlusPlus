import mongoose from "mongoose"
import Subject from "../../models/subject.model.js"
import Section from "../../models/section.model.js"
import Schedule from "../../models/schedule.model.js"
import deleteSession from "../session/session.delete_session.js"

export default class SectionController {
	// NOTE: CREATE
	static async newSection(req, res) {
		const sectionNrc = req?.query?.nrc
		const sectionTeacher = req?.query?.teacher
		const sessions = req?.query?.sessionsIds
		const subjectName = req?.query?.subjectName

		if (subjectName === undefined) {
			res?.send({ message: "ERROR Subject name is undefined", code: 0 })
			return { message: "ERROR Subject name is undefined", code: 0 }
		} else if (await Subject.exists({ name: subjectName }).then(res => res === null)) {
			res?.send({ message: "ERROR Subject does not exist", code: 0 })
			return { message: "ERROR Subject does not exist", code: 0 }
		}

		if (sectionNrc !== undefined) {
			if (await Section.exists({ nrc: sectionNrc }).then(res => res !== null)) {
				res?.send({ message: "ERROR Duplicate NRC", code: 0 })
				return { message: "ERROR Duplicate NRC", code: 0 }
			}
		}

		const sectionCount = await Section.find().countDocuments() ?? 0
		const relatedSubject = await Subject.findOne({ name: subjectName })
		const newSection = new Section({
			_id: new mongoose.mongo.ObjectId,
			nrc: sectionNrc ?? parseInt(sectionCount),
			teacher: sectionTeacher ?? "Por Asignar",
			sessions: sessions?.split(',') ?? [],
			subject: new mongoose.mongo.ObjectId(relatedSubject._id)
		})

		const savedSection = await newSection.save()
		if (savedSection !== newSection) {
			res?.send({ message: "ERROR an unknown error has ocurred", code: 0 })
			return { message: "ERROR an unknown error has ocurred", code: 0 }
		}

		await Subject.findOneAndUpdate(relatedSubject,
			{ sections: relatedSubject.sections.concat(new mongoose.mongo.ObjectId(savedSection._id)) })

		res?.send(savedSection)
		return savedSection
	}

	// NOTE: READ
	static async getSection(req, res) {
		const sectionNRC = req?.query?.nrc

		if (sectionNRC === undefined) {
			res?.send({ message: "ERROR sectionNRC is undefined", code: 0 })
			return { message: "ERROR sectionNRC is undefined", code: 0 }
		}

		const foundSection = await Section.findOne({ nrc: sectionNRC })
		if (foundSection === undefined || foundSection === null) {
			res?.send({ message: "ERROR section with nrc " + sectionNRC + " was not found", code: 0 })
			return { message: "ERROR section with nrc " + sectionNRC + " was not found", code: 0 }
		}

		res?.send(foundSection)
		return foundSection
	}

	static async getSections(req, res) {
		const subjectName = req?.query?.subjectName

		if (subjectName === undefined) {
			res?.send({ message: "ERROR subjectName is undefined", code: 0 })
			return { message: "ERROR subjectName is undefined", code: 0 }
		}

		if (await Subject.exists({ name: subjectName }) === null) {
			res?.send({ message: "ERROR subject does not exist", code: 0 })
			return { message: "ERROR subject does not exist", code: 0 }
		}

		const subject = await Subject.findOne({ name: subjectName })
		const foundSections = await Section.find({ subject: new mongoose.mongo.ObjectId(subject._id) })

		res?.send(foundSections)
		return foundSections
	}

	// NOTE: UPDATE
	static async updateSection(req, res) {
		const oldNrc = req?.query?.oldNrc
		const newNrc = req?.query?.newNrc
		const newTeacher = req?.query?.newTeacher

		if (oldNrc === undefined) {
			res?.send({ message: "ERROR oldNrc is undefined", code: 0 })
			return { message: "ERROR oldNrc is undefined", code: 0 }
		}

		if (newNrc === undefined && newTeacher === undefined) {
			res?.send({ message: "ERROR newNrc and newTeacher are both undefined", code: 0 })
			return { message: "ERROR newNrc and newTeacher are both undefined", code: 0 }
		}

		const oldSection = await Section.findOne({ nrc: oldNrc })
		if (oldSection === undefined || oldSection === null) {
			res?.send({ message: "ERROR section with nrc " + oldNrc + " was not found", code: 0 })
			return { message: "ERROR section with nrc " + oldNrc + " was not found", code: 0 }
		}

		const updatedSection = await Section.findOneAndUpdate(oldSection, {
			nrc: newNrc ?? oldSection.nrc,
			teacher: newTeacher ?? oldSection.teacher,
		}, { new: true }) // the new options returns the documents new version

		res?.send(updatedSection)
		return updatedSection
	}

	// NOTE: DELETE
	static async deleteSection(req, res) {
		const mongoId = req?.query?.id
		if (mongoId !== undefined) {
			const foundSection = await Section.findById(mongoId)
			if (foundSection === null || foundSection === undefined) {
				res?.send({ message: "ERROR mongoId provided but section not found", code: 0 })
				return { message: "ERROR mongoId provided but section not found", code: 0 }
			}
			await Section.findByIdAndDelete(mongoId)

			const subjectToUpdate = await Subject.findById(foundSection.subject)
			if (subjectToUpdate !== null && subjectToUpdate !== undefined) {
				await Subject.findByIdAndUpdate(subjectToUpdate._id, {
					sections: subjectToUpdate.sections.filter(x => !x._id.equals(mongoId))
				})
			}

			for (const sessionId of foundSection.sessions) {
				await deleteSession({ query: { id: sessionId } })
			}

			res?.send(foundSection)
			return foundSection
		}

		const sectionNrc = req?.query?.nrc

		if (sectionNrc !== undefined) {
			if (await Section.exists({ nrc: sectionNrc }) === null) {
				res?.send({ message: "ERROR Section does not exist", code: 0 })
				return { message: "ERROR Section does not exist", code: 0 }
			}
		}

		const deletedData = await Section.findOneAndDelete({ nrc: sectionNrc })
		if (deletedData === undefined || deletedData === null) {
			// This error should never happen
			res?.send({ message: "ERROR an unexpected error has occured", code: 0 })
			return { message: "ERROR an unexpected error has occured", code: 0 }
		}


		const subjectToUpdate = await Subject.findById(deletedData.subject)
		const updatedSubject = await Subject.findOneAndUpdate(subjectToUpdate,
			{ sections: subjectToUpdate?.sections.filter(id => !id.equals(deletedData._id)) })

		for (const sessionId of deletedData.sessions) {
			await deleteSession({ query: { id: sessionId } })
		}
		// We want to remove all of the schedules that contain the deleted section
		const schedulesToDelete = await Schedule.deleteMany({ sections: deletedData._id })

		res?.send(deletedData)
		return deletedData
	}
}
