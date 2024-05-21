import Subject from "../../models/subject.model.js"

export default async function getSubjects(_, res) {
	const foundSubject = await Subject.find()
	if (foundSubject === undefined || foundSubject === null) {
		res?.send([])
		return []
	}

	res?.send(foundSubject)
	return foundSubject
}
