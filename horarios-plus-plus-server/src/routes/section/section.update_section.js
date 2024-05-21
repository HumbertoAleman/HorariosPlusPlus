import Section from "../../models/section.model.js"

export default async function updateSection(req, res) {
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
