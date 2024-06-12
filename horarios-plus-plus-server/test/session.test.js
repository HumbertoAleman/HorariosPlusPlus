import assert from "assert"
import SubjectController from "../src/routes/subject/SubjectController.js"
import SectionController from "../src/routes/section/SectionController.js"
import SessionController from "../src/routes/session/SessionController.js"
import Session from "../src/models/session.model.js"
import Section from "../src/models/section.model.js"

describe("Session CRUD", () => {
	let subject
	let section
	beforeEach(async () => {
		subject = await SubjectController.newSubject()
		section = await SectionController.newSection({ query: { subjectName: subject.name } })
	})

	// NOTE: CREATE SESSIONS
	describe("Create Sessions", () => {
		it("Create a new session", async () => {
			const session = await SessionController.newSession({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 6,
					endMinute: 15,
					nrc: section.nrc
				}
			})
			assert(await Session.checkIfIdExists(session._id) && await Section.findById(section._id).then(res => res.sessions.some(sessionId => sessionId.equals(session._id))))
		})
	})

	// NOTE: READ SESSIONS
	describe("Read Sessions", () => {
		let toRead
		beforeEach(async () => {
			toRead = await SessionController.newSession({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 6,
					endMinute: 15,
					nrc: section.nrc
				}
			})
		})

		it("Read a session from a section", async () => {
			assert(await SessionController.getSessions({ query: { nrc: section.nrc } }).then(res => res.at(0)._id.equals(toRead._id)))
		})
	})

	// NOTE: UPDATE SESSIONS
	describe("Update Sessions", () => {
		let toUpdate
		beforeEach(async () => {
			toUpdate = await SessionController.newSession({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 6,
					endMinute: 15,
					nrc: section.nrc
				}
			})
		})

		it("Update a session", async () => {
			const updatedSession = await SessionController.updateSession({
				query: {
					oldDay: 1,
					oldStartHour: 6,
					oldStartMinute: 0,
					oldEndHour: 6,
					oldEndMinute: 15,

					newDay: 2,
					newStartHour: 7,
					newStartMinute: 15,
					newEndHour: 7,
					newEndMinute: 30,

					nrc: section.nrc
				}
			})
			assert(updatedSession._id.equals(toUpdate._id) &&
				updatedSession.day === 2 &&
				updatedSession.start.hour === 7 &&
				updatedSession.start.minute === 15 &&
				updatedSession.end.hour === 7 &&
				updatedSession.end.minute === 30)
		})
	})

	// NOTE: DELETE SESSIONS
	describe("Delete Sessions", () => {
		let toDelete
		beforeEach(async () => {
			toDelete = await SessionController.newSession({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 6,
					endMinute: 15,
					nrc: section.nrc
				}
			})
		})

		it("Delete a session from a section", async () => {
			const deletedSession = SessionController.deleteSession({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 6,
					endMinute: 15,
					nrc: section.nrc
				}
			})

			assert(Session.checkIfIdExists(deletedSession._id).then(res => !res))
		})
	})
})
