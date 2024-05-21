import mongoose from "mongoose"
import Subject from "../../models/subject.model.js"
import Section from "../../models/subject.model.js"

export default async function getSections(req, res) {
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
