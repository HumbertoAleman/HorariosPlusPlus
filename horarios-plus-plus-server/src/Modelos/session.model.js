import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId
import Section from "./section.model.js"
import Schedule from "./schedule.model.js"

export default class Session {
	static #hoursIntersect(start_x, end_x, start_y, end_y) {
		return ((start_x.minute + start_x.hour * 60 < end_y.minute + end_y.hour * 60) &&
			(start_y.minute + start_y.hour * 60 < end_x.minute + end_x.hour * 60))
	}

	static #schema = new mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		start: {
			hour: { type: Number, required: true },
			minute: { type: Number, required: true },
		},
		end: {
			hour: { type: Number, required: true },
			minute: { type: Number, required: true },
		},
		day: { type: Number, required: true },
		section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" }
	})

	static findOne = async (data) => await Session.#model.findOne(data)
	static findById = async (id) => await Session.#model.findById(id)
	static findByIdAndUpdate = async (id, newData) =>
		await Session.#model.findByIdAndUpdate(id, newData, { new: true })

	static findOneAndDelete = async (data) =>
		await Session.#model.findOneAndDelete(data)
	static findByIdAndDelete = async (id) =>
		await Session.#model.findByIdAndDelete(id)

	static checkIfExists = async (data) => await Session.#model.find(data).then(res => res !== undefined && res !== null)
	static checkIfIdExists = async (id) => await Session.#model.findById(id).then(res => res !== undefined && res !== null)

	static dropDb = async () => await mongoose.connection.collections.sections.drop()

	static #model = mongoose.model("Session", Session.#schema)

	// NOTE: CREATE
	static save = async (sessionDay, sessionStart, sessionEnd, sectionNrc) => {
		if (sectionNrc === undefined)
			return { message: "ERROR sessionNRC is undefined", code: 0 }
		if (await Section.checkIfExists(sectionNrc).then(res => !res))
			return { message: "ERROR session with nrc " + nrc + " does not exist", code: 0 }
		const section = await Section.findOne(sectionNrc)

		if (sessionStart.minute === undefined || sessionStart.hour === undefined)
			return { message: "ERROR sessionStart is undefined", code: 0 }
		sessionStart.hour = parseInt(sessionStart.hour)
		sessionStart.minute = parseInt(sessionStart.minute)

		if (sessionEnd.minute === undefined || sessionEnd.hour === undefined)
			return { message: "ERROR sessionEnd is undefined", code: 0 }
		sessionEnd.hour = parseInt(sessionEnd.hour)
		sessionEnd.minute = parseInt(sessionEnd.minute)

		console.log(sessionStart)
		console.log(sessionEnd)

		if (sessionStart.hour * 60 + sessionStart.minute >= sessionEnd.hour * 60 + sessionEnd.minute)
			return { message: "ERROR start cannot be equal to/before end", code: 0 }

		if (sessionDay === undefined)
			return { message: "ERROR sessionDay is undefined", code: 0 }
		sessionDay = parseInt(sessionDay)

		const sessionList = []
		for (const sessionId of section.sessions)
			await Session.findById(sessionId).then(res => res ? sessionList.push(res) : undefined)

		if (sessionList.some(session => session.day === sessionDay && Session.#hoursIntersect(sessionStart, sessionEnd, session.start, session.end)))
			return { message: "ERROR sessions collide", code: 0 }

		const newSession = new Session.#model({
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
			section: new ObjectId(section._id)
		})

		const savedSession = await newSession.save()
		if (savedSession !== newSession)
			return { message: "ERROR an unexpected error has occurred", code: 0 }

		const updatedSection = await Section.byIdAddSession(section._id, newSession._id)

		// We want to remove all of the schedules that contain the modified section
		// TODO: READD THIS WHEN WE IMPLEMENT SCHEDULES
		// await Schedule.deleteMany({ sections: new ObjectId(updatedSection._id) })

		return savedSession
	}

	// NOTE: READ
	static get = async (sectionNrc) => {
		if (sectionNrc === undefined)
			return { message: "ERROR sectionNrc is undefined", code: 0 }
		if (await Section.checkIfExists(sectionNrc).then(res => !res))
			return { message: "ERROR section with nrc " + sectionNrc + " does not exist", code: 0 }

		const sessions = []
		for (const sessionId of await Section.findOne(sectionNrc).then(res => res.sessions))
			await Session.findById(sessionId).then(res => sessions.push(res))

		return sessions
	}

	// NOTE: UPDATE
	static update = async (
		oldSessionDay, oldSessionStart, oldSessionEnd,
		newSessionDay, newSessionStart, newSessionEnd,
		sectionNrc) => {

		if (sectionNrc === undefined)
			return { message: "ERROR sectionNrc is undefined", code: 0 }
		sectionNrc = parseInt(sectionNrc)

		if (await Section.checkIfExists(sectionNrc).then(res => !res))
			return { message: "ERROR NRC " + sectionNrc + " does not exist", code: 0 }
		const section = await Section.findOne(sectionNrc)

		if (oldSessionStart.minute === undefined || oldSessionStart.hour === undefined)
			return { message: "ERROR oldSessionStart is undefined", code: 0 }
		oldSessionStart.hour = parseInt(oldSessionStart.hour)
		oldSessionStart.minute = parseInt(oldSessionStart.minute)

		if (oldSessionEnd.minute === undefined || oldSessionEnd.hour === undefined)
			return { message: "ERROR oldSessionEnd is undefined", code: 0 }
		oldSessionEnd.hour = parseInt(oldSessionEnd.hour)
		oldSessionEnd.minute = parseInt(oldSessionEnd.minute)

		if (oldSessionDay === undefined)
			return { message: "ERROR oldSessionDay is undefined", code: 0 }
		oldSessionDay = parseInt(oldSessionDay)

		newSessionStart.hour = parseInt(newSessionStart.hour)
		newSessionStart.minute = parseInt(newSessionStart.minute)
		newSessionEnd.hour = parseInt(newSessionEnd.hour)
		newSessionEnd.minute = parseInt(newSessionEnd.minute)
		newSessionDay = parseInt(newSessionDay)

		if ((newSessionStart.hour * 60 + newSessionStart.minute) >=
			(newSessionEnd.hour * 60 + newSessionEnd.minute))
			return { message: "ERROR start cannot be equal to/before end", code: 0 }

		console.log(oldSessionDay)
		console.log(oldSessionStart)
		console.log(oldSessionEnd)

		const oldSession = await Session.findOne({
			day: oldSessionDay,
			start: {
				hour: oldSessionStart.hour,
				minute: oldSessionStart.minute,
			},
			end: {
				hour: oldSessionEnd.hour,
				minute: oldSessionEnd.minute,
			},
			section: new ObjectId(section._id)
		})
		if (oldSession === undefined || oldSession === null)
			return { message: "ERROR session was not found", code: 0 }

		let sessionList = []
		for (const sessionId of section.sessions.filter(session => !session.equals(oldSession._id)))
			await Session.findById(sessionId).then(session => {
				if (session !== undefined)
					sessionList.push(session)
			})

		if (sessionList.some(session => session.day === newSessionDay && hoursIntersect(newSessionStart, newSessionEnd, session.start, session.end)))
			return { message: "ERROR sessions collide", code: 0 }

		const updatedSession = await Session.findByIdAndUpdate(oldSession._id, {
			day: newSessionDay,
			start: {
				hour: newSessionStart.hour,
				minute: newSessionStart.minute,
			},
			end: {
				hour: newSessionEnd.hour,
				minute: newSessionEnd.minute,
			},
		})

		// We want to remove all of the schedules that contain the modified session
		// TODO: READD WHEN ADDING SCHEDULE FUNCTIONALITY
		// const schedulesToDelete = await Schedule.deleteMany({ sections: new mongoose.mongo.ObjectId(updatedSession.section) })

		return updatedSession
	}

	static delete = async (sessionDay, sessionStart, sessionEnd, sectionNrc) => {
		if (sectionNrc === undefined)
			return { message: "ERROR sessionNRC is undefined", code: 0 }
		sectionNrc = parseInt(sectionNrc)

		if (await Section.checkIfExists(sectionNrc).then(res => !res))
			return { message: "ERROR session with nrc " + sectionNrc + " does not exist", code: 0 }
		const sectionToUpdate = await Section.findOne(sectionNrc)

		if (sessionStart.minute === undefined || sessionStart.hour === undefined)
			return { message: "ERROR sessionStart is undefined", code: 0 }
		sessionStart.hour = parseInt(sessionStart.hour)
		sessionStart.minute = parseInt(sessionStart.minute)

		if (sessionEnd.minute === undefined || sessionEnd.hour === undefined)
			return { message: "ERROR sessionEnd is undefined", code: 0 }
		sessionEnd.hour = parseInt(sessionEnd.hour)
		sessionEnd.minute = parseInt(sessionEnd.minute)

		if (sessionDay === undefined)
			return { message: "ERROR sessionDay is undefined", code: 0 }
		sessionDay = parseInt(sessionDay)

		const deletedData = await Session.findOneAndDelete({
			day: sessionDay,
			start: {
				hour: sessionStart.hour,
				minute: sessionStart.minute,
			},
			end: {
				hour: sessionEnd.hour,
				minute: sessionEnd.minute,
			},
			section: new ObjectId(sectionToUpdate._id)
		})
		if (deletedData === undefined || deletedData === null)
			return { message: "ERROR could not find session to delete", code: 0 }

		Section.byIdRemoveSession(sectionToUpdate._id, deletedData._id)

		// TODO: when adding schedule functionality add this back
		// await Schedule.deleteMany({ sections: new ObjectId(deletedData.section) })

		return deletedData
	}

	static deleteById = async (id) => {
		if (await Section.checkIfIdExists(id).then(res => !res))
			return { message: "ERROR session with id " + id + " does not exist", code: 0 }

		const deletedData = await Session.findByIdAndDelete(id)
		if (deletedData === undefined || deletedData === null)
			return { message: "ERROR could not find session to delete", code: 0 }

		Section.byIdRemoveSession(sectionToUpdate._id, deletedData._id)
		await Schedule.deleteMany({ sections: new ObjectId(deletedData.section) })

		return deletedData

	}
}
