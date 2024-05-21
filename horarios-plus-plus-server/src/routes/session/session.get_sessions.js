import Section from "../../models/section.model.js"
import Session from "../../models/session.model.js"

export default async function getSessions(req, res) {
	const sectionNRC = req?.query?.nrc

	if (sectionNRC === undefined) {
		res?.send({ message: "ERROR sectionNRC is undefined", code: 0 })
		return { message: "ERROR sectionNRC is undefined", code: 0 }
	}

	const section = await Section.findOne({ nrc: sectionNRC })
	if (section === undefined || section === null) {
		res?.send({ message: "ERROR section does not exist", code: 0 })
		return { message: "ERROR section does not exist", code: 0 }
	}

	const sessions = []
	for (const sessionId of section.sessions) {
		sessions.push(await Session.findById(sessionId))
	}

	res?.send(sessions)
	return sessions
}
