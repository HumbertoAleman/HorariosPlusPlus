import mongoose from "mongoose"
import assert from "assert"

import newSession from "../src/routes/session/session.new_session.js"
import deleteSession from "../src/routes/session/session.delete_session.js"

import newSubject from "../src/routes/subject/subject.new_subject.js"
import newSection from "../src/routes/section/section.new_section.js"

import Section from "../src/models/section.model.js";
import Session from "../src/models/session.model.js"

import getSessions from "../src/routes/session/session.get_sessions.js"
import updateSession from "../src/routes/session/session.update_session.js"

describe("Session CRUD", () => {
	let subject
	let section

	beforeEach(async () => {
		subject = await newSubject({ query: { name: "Subject" } });
		section = await newSection({ query: { subjectName: subject.name } })
	})

	// NOTE: CREATE SESSIONS
	describe("Create Sessions", () => {
		it("Create Basic Session", async () => {
			assert(await newSession({
				query: {
					day: 1,
					startMinute: 0,
					startHour: 6,
					endMinute: 15,
					endHour: 6,
					nrc: section.nrc,
				}
			}).then(res => res !== 0))
		})

		it("Create session and ensure that session is in section when created", async () => {
			let createdSession = await newSession({
				query: {
					day: 1,
					startMinute: 0,
					startHour: 6,
					endMinute: 15,
					endHour: 6,
					nrc: section.nrc,
				}
			})

			assert(await Section
				.findById(section._id)
				.then(res =>
					res.sessions.some(id => id.equals(createdSession._id))
				))
		})

		it("Throw if start data is missing", async () => {
			assert(await newSession({
				query: {
					day: 1,
					endMinute: 15,
					endHour: 6,
					nrc: section.nrc,
				}
			}).then(res => res.message === "ERROR sessionStart is undefined"))
		})

		it("Throw if end data is missing", async () => {
			assert(await newSession({
				query: {
					day: 1,
					startMinute: 0,
					startHour: 6,
					nrc: section.nrc,
				}
			}).then(res => res.message === "ERROR sessionEnd is undefined"))
		})

		it("Throw if day data is missing", async () => {
			assert(await newSession({
				query: {
					startMinute: 0,
					startHour: 6,
					endMinute: 15,
					endHour: 6,
					nrc: section.nrc,
				}
			}).then(res => res.message === "ERROR sessionDay is undefined"))
		})

		it("Throw if NRC is missing", async () => {
			assert(await newSession({
				query: {
					day: 1,
					startMinute: 0,
					startHour: 6,
					endMinute: 15,
					endHour: 6,
				}
			}).then(res => res.message === "ERROR sessionNRC is undefined"))
		})

		it("Throw if NRC does not exist", async () => {
			assert(await newSession({
				query: {
					day: 1,
					startMinute: 0,
					startHour: 6,
					endMinute: 15,
					endHour: 6,
					nrc: 42
				}
			}).then(res => res.message === "ERROR this NRC does not exist"))
		})

		it("Throw if two sessions intersect", async () => {
			await newSession({
				query: {
					day: 1,
					startMinute: 15,
					startHour: 6,
					endMinute: 45,
					endHour: 6,
					nrc: section.nrc,
				}
			})

			assert(await newSession({
				query: {
					day: 1,
					startMinute: 30,
					startHour: 6,
					endMinute: 15,
					endHour: 7,
					nrc: section.nrc,
				}
			}).then(res => res.message === "ERROR sessions collide"))
		})

		it("Throw start hour is after end hour", async () => {
			assert(await newSession({
				query: {
					day: 1,
					startMinute: 30,
					startHour: 7,
					endMinute: 15,
					endHour: 6,
					nrc: section.nrc,
				}
			}).then(res => res.message === "ERROR start cannot be equal to/before end"))
		})
	})

	// NOTE: READ SESSIONS
	describe("Read Sessions", () => {
		let toRead
		beforeEach(async () => {
			toRead = await newSession({
				query: {
					day: 1,
					startMinute: 15,
					startHour: 6,
					endMinute: 45,
					endHour: 6,
					nrc: section.nrc,
				}
			})
		})

		it("Get session from nrc", async () => {
			assert(await getSessions({ query: { nrc: section.nrc }})
			.then(res => res.at(0).equals(toRead)))
		})

		it("Throw if NRC is undefined", async () => {
			assert(await getSessions({ query: { nrc: undefined }})
			.then(res => res.message === "ERROR sectionNRC is undefined" ))
		})

		it("Throw if NRC is not found", async () => {
			assert(await getSessions({ query: { nrc: "999" }})
			.then(res => res.message === "ERROR section does not exist" ))
		})
	})

	// NOTE: UPDATE SESSIONS
	describe("Update Sessions", () => {
		let toUpdate
		beforeEach(async () => {
			toUpdate = await newSession({
				query: {
					day: 1,
					startMinute: 15,
					startHour: 6,
					endMinute: 45,
					endHour: 8,
					nrc: section.nrc,
				}
			})
		})

		it("Update session day", async () => {
			const newDay = 2
			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				nrc: section.nrc,
				newDay: newDay
			}}).then(res => res._id.equals(toUpdate._id) && res.day === newDay))
		})

		it("Update start minutes", async () => {
			const newStartMinutes = 30
			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				nrc: section.nrc,
				newStartMinute: newStartMinutes
			}}).then(res => res._id.equals(toUpdate._id) && res.start.minute === newStartMinutes))
		})

		it("Update start hour", async () => {
			const newStartHours = 7
			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				nrc: section.nrc,
				newStartHour: newStartHours
			}}).then(res => res._id.equals(toUpdate._id) && res.start.hour === newStartHours))
		})

		it("Update end minutes", async () => {
			const newEndMinutes = 30
			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				nrc: section.nrc,
				newEndMinute: newEndMinutes
			}}).then(res => res._id.equals(toUpdate._id) && res.end.minute === newEndMinutes))
		})

		it("Update end hour", async () => {
			const newEndHour = 7
			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				nrc: section.nrc,
				newEndHour: newEndHour
			}}).then(res => res._id.equals(toUpdate._id) && res.end.hour === newEndHour))
		})

		it("Throw if new start is ahead of old end", async () => {
			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				nrc: section.nrc,
				newStartHour: 10,
				newStartMinute: 0
			}}).then(res => res.message === "ERROR start cannot be equal to/before end"))
		})

		it("Throw if new end is behind of old start", async () => {
			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				nrc: section.nrc,
				newEndHour: 6,
				newEndMinute: 0
			}}).then(res => res.message === "ERROR start cannot be equal to/before end"))
		})

		it("Throw if oldDay is undefined", async () => {
			assert(await updateSession({ query: {
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				nrc: section.nrc,
			}}).then(res => res.message === "ERROR oldSessionDay is undefined"))
		})


		it("Throw if oldSessionStart is undefined", async () => {
			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				nrc: section.nrc,
			}}).then(res => res.message === "ERROR oldSessionStart is undefined"))
		})

		it("Throw if oldSessionEnd is undefined", async () => {
			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				nrc: section.nrc,
			}}).then(res => res.message === "ERROR oldSessionEnd is undefined"))
		})

		it("Throw if nrc is undefined", async () => {
			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
			}}).then(res => res.message === "ERROR sectionNrc is undefined"))
		})

		it("Throw if nrc is not found", async () => {
			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				nrc: "48"
			}}).then(res => res.message === "ERROR NRC 48 does not exist"))
		})

		it("Throw session collides with another session", async () => {
			await newSession({
				query: {
					day: 1,
					startHour: 9,
					startMinute: 0,
					endHour: 10,
					endMinute: 0,
					nrc: section.nrc,
				}
			})

			assert(await updateSession({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				nrc: section.nrc,
				newEndHour: 10,
				newEndMinute: 45,
				newStartHour: 9,
				newStartMinute: 45,
			}}).then(res => res.message === "ERROR sessions collide"))
		})
	})

	// NOTE: DELETE SESSIONS
	describe("Delete Sessions", () => {
		let toDelete
		beforeEach(async () => {
			toDelete = await newSession({
				query: {
					day: 1,
					startMinute: 15,
					startHour: 6,
					endMinute: 45,
					endHour: 6,
					nrc: section.nrc,
				}
			})
		})

		it("Delete session with all data", async () => {
			assert(await deleteSession({
				query: {
					day: toDelete.day,
					startMinute: toDelete.start.minute,
					startHour: toDelete.start.hour,
					endMinute: toDelete.end.minute,
					endHour: toDelete.end.hour,
					nrc: section.nrc
				}
			}).then(async res => await Session.findById(res._id))
				.then(res => res === undefined || res === null))
		})

		it("Delete session and ensure that session is eliminated from section", async () => {
			await deleteSession({
				query: {
					day: toDelete.day,
					startMinute: toDelete.start.minute,
					startHour: toDelete.start.hour,
					endMinute: toDelete.end.minute,
					endHour: toDelete.end.hour,
					nrc: section.nrc
				}
			})

			assert(await Section.findById(section._id).then(res => !res.sessions.some(id => id.equals(toDelete._id))))
		})

		it("Throw when day is wrong", async () => {
			assert(await deleteSession({
				query: {
					day: 3,
					startMinute: toDelete.start.minute,
					startHour: toDelete.start.hour,
					endMinute: toDelete.end.minute,
					endHour: toDelete.end.hour,
					nrc: section.nrc
				}
			}).then(res => res.message === "ERROR could not find session to delete"))
		})

		it("Throw when day is missing", async () => {
			assert(await deleteSession({
				query: {
					startMinute: toDelete.start.minute,
					startHour: toDelete.start.hour,
					endMinute: toDelete.end.minute,
					endHour: toDelete.end.hour,
					nrc: section.nrc
				}
			}).then(res => res.message === "ERROR sessionDay is undefined"))
		})

		it("Throw when start time is wrong", async () => {
			assert(await deleteSession({
				query: {
					day: toDelete.day,
					startMinute: 10,
					startHour: 10,
					endMinute: toDelete.end.minute,
					endHour: toDelete.end.hour,
					nrc: section.nrc
				}
			}).then(res => res.message === "ERROR could not find session to delete"))
		})

		it("Throw when start time is missing", async () => {
			assert(await deleteSession({
				query: {
					day: toDelete.day,
					endMinute: toDelete.end.minute,
					endHour: toDelete.end.hour,
					nrc: section.nrc
				}
			}).then(res => res.message === "ERROR sessionStart is undefined"))
		})


		it("Throw when end time is wrong", async () => {
			assert(await deleteSession({
				query: {
					day: toDelete.day,
					startMinute: toDelete.start.minute,
					startHour: toDelete.start.hour,
					endMinute: 10,
					endHour: 10,
					nrc: section.nrc
				}
			}).then(res => res.message === "ERROR could not find session to delete"))
		})

		it("Throw when end time is missing", async () => {
			assert(await deleteSession({
				query: {
					day: toDelete.day,
					startMinute: toDelete.start.minute,
					startHour: toDelete.start.hour,
					nrc: section.nrc
				}
			}).then(res => res.message === "ERROR sessionEnd is undefined"))
		})

		it("Throw when NRC doesnt exist", async () => {
			assert(await deleteSession({
				query: {
					day: toDelete.day,
					startMinute: toDelete.start.minute,
					startHour: toDelete.start.hour,
					endMinute: toDelete.end.minute,
					endHour: toDelete.end.hour,
					nrc: 32
				}
			}).then(res => res.message === "ERROR this NRC does not exist"))
		})

		it("Throw when NRC is missing", async () => {
			assert(await deleteSession({
				query: {
					day: toDelete.day,
					startMinute: toDelete.start.minute,
					startHour: toDelete.start.hour,
					endMinute: toDelete.end.minute,
					endHour: toDelete.end.hour,
				}
			}).then(res => res.message === "ERROR sessionNRC is undefined"))
		})
	})
})
