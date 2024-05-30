import mongoose from "mongoose"
import Section from "../../models/section.model.js"
import Session from "../../models/session.model.js"
import Schedule from "../../models/schedule.model.js"

function hoursIntersect(start_x, end_x, start_y, end_y) {
	return ((start_x.minute + start_x.hour * 60 < end_y.minute + end_y.hour * 60) &&
		(start_y.minute + start_y.hour * 60 < end_x.minute + end_x.hour * 60))
}

export default async function updateSession(req, res) {
	const oldSessionDay = req?.query?.oldDay
	const oldSessionStart = {
		minute: req?.query?.oldStartMinute,
		hour: req?.query?.oldStartHour
	}
	const oldSessionEnd = {
		minute: req?.query?.oldEndMinute,
		hour: req?.query?.oldEndHour
	}
	const sectionNrc = req?.query?.nrc

	if (sectionNrc === undefined) {
		res?.send({ message: "ERROR sectionNrc is undefined", code: 0 })
		return { message: "ERROR sectionNrc is undefined", code: 0 }
	} else if (await Section.exists({ nrc: sectionNrc }).then(res => res === null)) {
		res?.send({ message: "ERROR NRC " + sectionNrc + " does not exist", code: 0 })
		return { message: "ERROR NRC " + sectionNrc + " does not exist", code: 0 }
	}

	if (oldSessionStart.minute === undefined || oldSessionStart.hour === undefined) {
		res?.send({ message: "ERROR oldSessionStart is undefined", code: 0 })
		return { message: "ERROR oldSessionStart is undefined", code: 0 }
	}

	if (oldSessionEnd.minute === undefined || oldSessionEnd.hour === undefined) {
		res?.send({ message: "ERROR oldSessionEnd is undefined", code: 0 })
		return { message: "ERROR oldSessionEnd is undefined", code: 0 }
	}

	if (oldSessionDay === undefined) {
		res?.send({ message: "ERROR oldSessionDay is undefined", code: 0 })
		return { message: "ERROR oldSessionDay is undefined", code: 0 }
	}

	const newSessionDay = req?.query?.newDay ?? oldSessionDay
	const newSessionStart = {
		minute: req?.query?.newStartMinute ?? oldSessionStart.minute,
		hour: req?.query?.newStartHour ?? oldSessionStart.hour
	}
	const newSessionEnd = {
		minute: req?.query?.newEndMinute ?? oldSessionEnd.minute,
		hour: req?.query?.newEndHour ?? oldSessionEnd.hour
	}

	if ((newSessionStart.hour * 60 + newSessionStart.minute) >=
		(newSessionEnd.hour * 60 + newSessionEnd.minute)) {
		res?.send({ message: "ERROR start cannot be equal to/before end", code: 0 })
		return { message: "ERROR start cannot be equal to/before end", code: 0 }
	}

	const section = await Section.findOne({ nrc: sectionNrc })

	const oldSession = await Session.findOne({
		day: oldSessionDay,
		start: oldSessionStart,
		end: oldSessionEnd,
		section: new mongoose.mongo.ObjectId(section._id)
	})

	if (oldSession === undefined || oldSession === null) {
		res?.send({ message: "ERROR session was not found", code: 0 })
		return { message: "ERROR was not found", code: 0 }
	}

	let sessionList = []
	for (const sessionId of section.sessions) {
		if (sessionId.equals(oldSession._id)) { continue; }
		let session = await Session.findById(sessionId)
		if (session) { sessionList.push(session) }
	}

	if (sessionList.some(session => session.day === newSessionDay && hoursIntersect(newSessionStart, newSessionEnd, session.start, session.end))) {
		res?.send({ message: "ERROR sessions collide", code: 0 })
		return { message: "ERROR sessions collide", code: 0 }
	}


	const updatedSession = await Session.findByIdAndUpdate(oldSession._id, {
		day: newSessionDay,
		start: newSessionStart,
		end: newSessionEnd,
	}, { new: true }) // we set the new flag to return the updated version

	// We want to remove all of the schedules that contain the modified session
	const schedulesToDelete = await Schedule.deleteMany({ sections: new mongoose.mongo.ObjectId(updatedSession.section) })

	res?.send(updatedSession)
	return updatedSession
}
