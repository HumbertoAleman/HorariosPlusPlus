import mongoose from "mongoose"
import Subject from "../../models/subject.model.js"

export default async function newSubject(req, res) {
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
