import mongoose from "mongoose"
import assert from "assert"

import newSession from "../src/routes/session/session.new_session.js"
import deleteSession from "../src/routes/session/session.delete_session.js"

import newSubject from "../src/routes/subject/subject.new_subject.js"
import newSection from "../src/routes/section/section.new_section.js"

import Section from "../src/models/section.model.js";
import Subject from "../src/models/subject.model.js";
import getSessions from "../src/routes/session/session.get_sessions.js"

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
	})

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
			}).then(res => res._id.equals(toDelete._id)))
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
