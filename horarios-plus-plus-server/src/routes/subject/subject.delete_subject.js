import Subject from "../../models/subject.model.js"
import deleteSection from "../section/section.delete_section.js"

export default async function deleteSubject(req, res) {
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
		await deleteSection({ query: { id: sectionId } })
	}

	res?.send(deletedData)
	return deletedData
}
