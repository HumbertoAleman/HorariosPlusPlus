import mongoose from "mongoose"
import Section from "../../models/section.model.js"
import Session from "../../models/session.model.js"
import Schedule from "../../models/schedule.model.js"

export default class SessionController {

	static #hoursIntersect(start_x, end_x, start_y, end_y) {
		return ((start_x.minute + start_x.hour * 60 < end_y.minute + end_y.hour * 60) &&
			(start_y.minute + start_y.hour * 60 < end_x.minute + end_x.hour * 60))
	}

	// NOTE: CREATE
	static async newSession(req, res) {
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

		if (sessionList.some(session => session.day === sessionDay && SessionController.#hoursIntersect(sessionStart, sessionEnd, session.start, session.end))) {
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

		const updatedSection = await Section.findOneAndUpdate(section,
			{ sessions: section.sessions.concat(new mongoose.mongo.ObjectId(savedSession._id)) }, { new: true })

		// We want to remove all of the schedules that contain the modified section
		const schedulesToDelete = await Schedule.deleteMany({ sections: new mongoose.mongo.ObjectId(updatedSection._id) })

		res?.send(savedSession)
		return savedSession
	}

	// NOTE: READ
	static async getSessions(req, res) {
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

	// NOTE: UPDATE
	static async updateSession(req, res) {
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

	// NOTE: DELETE
	static async deleteSession(req, res) {
		const mongoId = req?.query?.id
		if (mongoId !== undefined) {
			const foundSession = await Session.findById(mongoId)
			if (foundSession === null || foundSession === undefined) {
				res?.send({ message: "ERROR mongoId provided but session not found", code: 0 })
				return { message: "ERROR mongoId provided but session not found", code: 0 }
			}
			await Session.findByIdAndDelete(mongoId)

			const sectionToUpdate = await Section.findById(foundSession.section)
			if (sectionToUpdate !== null && sectionToUpdate !== undefined) {
				const updatedSection = await Section.findByIdAndUpdate(sectionToUpdate._id, {
					sessions: sectionToUpdate.sessions.filter(x => !x._id.equals(mongoId))
				}, { new: true })
			}

			await Schedule.deleteMany({ sections: new mongoose.mongo.ObjectId(foundSession.section) })

			res?.send(foundSession)
			return foundSession
		}

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

		if (sessionDay === undefined) {
			res?.send({ message: "ERROR sessionDay is undefined", code: 0 })
			return { message: "ERROR sessionDay is undefined", code: 0 }
		}

		const sectionToUpdate = await Section.findOne({ nrc: sessionNrc })
		const deletedData = await Session.findOneAndDelete({
			day: sessionDay,
			start: sessionStart,
			end: sessionEnd,
			section: new mongoose.mongo.ObjectId(sectionToUpdate._id)
		})

		if (deletedData === undefined || deletedData === null) {
			// This error should never happen
			res?.send({ message: "ERROR could not find session to delete", code: 0 })
			return { message: "ERROR could not find session to delete", code: 0 }
		}

		const updatedSection = await Section.findOneAndUpdate(sectionToUpdate,
			{ sessions: sectionToUpdate.sessions.filter(id => !id.equals(deletedData._id)) }, { new: true })

		// We want to remove all of the schedules that contain the modified section
		await Schedule.deleteMany({ sections: new mongoose.mongo.ObjectId(deletedData.section) })

		res?.send(deletedData)
		return deletedData
	}
}


