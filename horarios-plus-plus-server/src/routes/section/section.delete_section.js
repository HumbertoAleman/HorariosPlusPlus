import mongoose from "mongoose"
import Section from "../../models/section.model.js"
import Subject from "../../models/subject.model.js"
import Session from "../../models/session.model.js"
import Schedule from "../../models/schedule.model.js"
import deleteSession from "../session/session.delete_session.js"

export default async function deleteSection(req, res) {
	const mongoId = req?.query?.id
	if (mongoId !== undefined) {
		const foundSection = await Section.findById(mongoId)
		if (foundSection === null || foundSection === undefined) {
			res?.send({ message: "ERROR mongoId provided but section not found", code: 0 })
			return { message: "ERROR mongoId provided but section not found", code: 0 }
		}
		await Section.findByIdAndDelete(mongoId)

		const subjectToUpdate = await Subject.findById(foundSection.subject)
		if (subjectToUpdate === null || subjectToUpdate === undefined) {
			res?.send({ message: "ERROR section has no subject attached", code: 0 })
			return { message: "ERROR section has no subject attached", code: 0 }
		}

		await Subject.findByIdAndUpdate(subjectToUpdate._id, {
			sections: subjectToUpdate.sections.filter(x => !x._id.equals(mongoId))
		})

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
