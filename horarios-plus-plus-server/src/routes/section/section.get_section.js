import Section from "../../models/section.model.js"

export default async function getSection(req, res) {
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
