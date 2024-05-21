import Subject from "../../models/subject.model.js"

export default async function updateSubject(req, res) {
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
