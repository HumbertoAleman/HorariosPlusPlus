import mongoose from "mongoose"
import Section from "../../models/section.model.js"
import Session from "../../models/session.model.js"

function hoursIntersect(start_x, end_x, start_y, end_y) {
	return ((start_x.minute + start_x.hour * 60 < end_y.minute + end_y.hour * 60) &&
		(start_y.minute + start_y.hour * 60 < end_x.minute + end_x.hour * 60))
}

export default async function newSession(req, res) {
	const sessionDay = req?.query?.day
	const sessionStart = {
		minute: req?.query?.startMinute,
		hour: req?.query?.startHour
	}
	const sessionEnd = {
		minute: req?.query?.endMinute,
		hour: req?.query?.endHour
	}
	const sessionNrc = req?.query?.nrc

	if (sessionNrc === undefined) {
		res?.send({ message: "ERROR sessionNRC is undefined", code: 0 })
		return { message: "ERROR sessionNRC is undefined", code: 0 }
	} else if (await Section.exists({ nrc: sessionNrc }).then(res => res === null)) {
		res?.send({ message: "ERROR this NRC does not exist", code: 0 })
		return { message: "ERROR this NRC does not exist", code: 0 }
	}

	if (sessionStart.minute === undefined || sessionStart.hour === undefined) {
		res?.send({ message: "ERROR sessionStart is undefined", code: 0 })
		return { message: "ERROR sessionStart is undefined", code: 0 }
	}

	if (sessionEnd.minute === undefined || sessionEnd.hour === undefined) {
		res?.send({ message: "ERROR sessionEnd is undefined", code: 0 })
		return { message: "ERROR sessionEnd is undefined", code: 0 }
	}

	if (sessionStart.hour * 60 + sessionStart.minute >= sessionEnd.hour * 60 + sessionEnd.minute) {
		res?.send({ message: "ERROR start cannot be equal to/before end", code: 0 })
		return { message: "ERROR start cannot be equal to/before end", code: 0 }
	}

	if (sessionDay === undefined) {
		res?.send({ message: "ERROR sessionDay is undefined", code: 0 })
		return { message: "ERROR sessionDay is undefined", code: 0 }
	}

	let section = await Section.findOne({ nrc: sessionNrc })
	let sessionList = []
	for (const sessionId of section.sessions) {
		let session = await Session.findById(sessionId)
		if (session) { sessionList.push(session) }
	}

	if (sessionList.some(session => session.day === sessionDay && hoursIntersect(sessionStart, sessionEnd, session.start, session.end))) {
		res?.send({ message: "ERROR sessions collide", code: 0 })
		return { message: "ERROR sessions collide", code: 0 }
	}

	let newSession = new Session({
		_id: new mongoose.mongo.ObjectId(),
		day: sessionDay,
		start: {
			hour: sessionStart.hour,
			minute: sessionStart.minute,
		},
		end: {
			hour: sessionEnd.hour,
			minute: sessionEnd.minute,
		},
		section: new mongoose.mongo.ObjectId(section._id)
	})

	const savedSession = await newSession.save()
	if (savedSession !== newSession) {
		// This error sould never happen
		res?.send({ message: "ERROR an unexpected error has occurred", code: 0 })
		return { message: "ERROR an unexpected error has occurred", code: 0 }
	}

	await Section.findOneAndUpdate(section,
		{ sessions: section.sessions.concat(new mongoose.mongo.ObjectId(savedSession._id)) })

	res?.send(savedSession)
	return savedSession
}
