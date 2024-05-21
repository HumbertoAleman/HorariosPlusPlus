import Subject from "../../models/subject.model.js"

export default async function getSubject(req, res) {
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
