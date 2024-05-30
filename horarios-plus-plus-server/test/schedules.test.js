import mongoose from "mongoose"
import assert from "assert"
import newSubject from "../src/routes/subject/subject.new_subject.js"
import generateSchedules from "../src/routes/schedule/schedule.new_schedule.js"
import newSection from "../src/routes/section/section.new_section.js"
import newSession from "../src/routes/session/session.new_session.js"
import Schedule from "../src/models/schedule.model.js"

import updateSession from "../src/routes/session/session.update_session.js"
import deleteSession from "../src/routes/session/session.delete_session.js"
import deleteSection from "../src/routes/section/section.delete_section.js"
import deleteSubject from "../src/routes/subject/subject.delete_subject.js"
import Subject from "../src/models/subject.model.js"

describe("Schedules CRUD", () => {

	// NOTE: Create Schedules
	describe("Create Schedules", () => {
		let subjectMath
		let toAddSectionMath
		let toAddSessionMath
		let toAddSessionMath2
		let toAddSessionMathCollide
		let subjectProgram
		let toAddSectionProgram
		let toAddSessionProgram
		let toAddSessionProgram2
		let toAddSessionProgramCollide
		let subjectLanguage
		let toAddSectionLanguage
		let toAddSessionLanguage
		let toAddSessionLanguage2
		let toAddSessionLanguageCollide
		beforeEach(async function() {
			this.timeout(10000)
			subjectMath = await newSubject({
				query: {
					name: "Math"
				}
			})
			toAddSectionMath = await newSection({
				query: {
					nrc: 1,
					teacher: "Some Dude",
					subjectName: "Math"
				}
			})
			toAddSessionMath2 = await newSession({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 8,
					endMinute: 30,
					nrc: 1
				}
			})
			toAddSessionMath = await newSession({
				query: {
					day: 2,
					startHour: 6,
					startMinute: 0,
					endHour: 8,
					endMinute: 30,
					nrc: 1
				}
			})
			// toAddSessionMathCollide = await newSession({
			// 	day: 3,
			// 	startHour: 6,
			// 	startMinute: 0,
			// 	endHour: 8,
			// 	endMinute: 30,
			// 	nrc: 1
			// })

			subjectProgram = await newSubject({
				query: {
					name: "Program"
				}
			})
			toAddSectionProgram = await newSection({
				query: {
					nrc: 2,
					teacher: "Another Dude",
					subjectName: "Program"
				}
			})
			toAddSessionProgram = await newSession({
				query: {
					day: 1,
					startHour: 10,
					startMinute: 0,
					endHour: 12,
					endMinute: 30,
					nrc: 2
				}
			})
			toAddSessionProgram2 = await newSession({
				query: {
					day: 2,
					startHour: 10,
					startMinute: 0,
					endHour: 12,
					endMinute: 30,
					nrc: 2
				}
			})
			// toAddSessionProgramCollide = await newSession({
			// 	day: 3,
			// 	startHour: 6,
			// 	startMinute: 0,
			// 	endHour: 8,
			// 	endMinute: 30,
			// 	nrc: 2
			// })

			subjectLanguage = await newSubject({
				query: {
					name: "Language"
				}
			})
			toAddSectionLanguage = await newSection({
				query: {
					nrc: 3,
					teacher: "Some Other Dude",
					subjectName: "Language"
				}
			})
			toAddSessionLanguage = await newSession({
				query: {
					day: 1,
					startHour: 14,
					startMinute: 0,
					endHour: 16,
					endMinute: 30,
					nrc: 3
				}
			})
			toAddSessionLanguage2 = await newSession({
				query: {
					day: 2,
					startHour: 14,
					startMinute: 0,
					endHour: 16,
					endMinute: 30,
					nrc: 3
				}
			})
			// toAddSessionLanguageCollide = await newSession({
			// 	day: 3,
			// 	startHour: 6,
			// 	startMinute: 0,
			// 	endHour: 8,
			// 	endMinute: 30,
			// 	nrc: 3
			// })
		})

		it("Create Schedule with non colliding subjects", async function() {
			this.timeout(10000)
			assert(await generateSchedules({
				query: {
					nrcs: "1,2,3"
				}
			}).then(res => {
				const nrcs = res.flat().map(section => section.nrc)
				return [toAddSectionMath, toAddSectionProgram, toAddSectionLanguage].map(section => section.nrc).every(nrc => nrcs.includes(nrc))
			}))
		})

		it("If a session is deleted, the schedule should be deleted", async function() {
			this.timeout(10000)
			const generatedSchedule = await generateSchedules({
				query: {
					nrcs: "1,2,3"
				}
			}).then(res => res.at(0))
			const scheduleObject = new Schedule({
				_id: new mongoose.mongo.ObjectId(),
				owner: new mongoose.mongo.ObjectId(),
				sections: generatedSchedule,
			})
			const toDelete = await scheduleObject.save()
			const wasAdded = await Schedule.findById(toDelete._id).then(res => res !== undefined && res !== null)
			if (!wasAdded)
				assert(false)

			await deleteSession({
				query: {
					day: toAddSessionMath.day,
					startHour: toAddSessionMath.start.hour,
					startMinute: toAddSessionMath.start.minute,
					endHour: toAddSessionMath.end.hour,
					endMinute: toAddSessionMath.end.minute,
					nrc: toAddSectionMath.nrc,
				}
			})

			assert(await Schedule.findById(toDelete._id).then(res => res === undefined || res === null))
		})

		it("If a session is updated, the schedule should be deleted", async function() {
			this.timeout(10000)
			const generatedSchedule = await generateSchedules({
				query: {
					nrcs: "1,2,3"
				}
			}).then(res => res.at(0))
			const scheduleObject = new Schedule({
				_id: new mongoose.mongo.ObjectId(),
				owner: new mongoose.mongo.ObjectId(),
				sections: generatedSchedule,
			})
			const toDelete = await scheduleObject.save()
			const wasAdded = await Schedule.findById(toDelete._id).then(res => res !== undefined && res !== null)
			if (!wasAdded)
				assert(false)

			await updateSession({
				query: {
					oldDay: toAddSessionMath.day,
					oldStartHour: toAddSessionMath.start.hour,
					oldStartMinute: toAddSessionMath.start.minute,
					oldEndHour: toAddSessionMath.end.hour,
					oldEndMinute: toAddSessionMath.end.minute,
					nrc: toAddSectionMath.nrc,
					newDay: 5,
				}
			})

			assert(await Schedule.findById(toDelete._id).then(res => res === undefined || res === null))
		})

		it("If a section is deleted, the schedule should be deleted", async function() {
			this.timeout(10000)
			const generatedSchedule = await generateSchedules({
				query: {
					nrcs: "1,2,3"
				}
			}).then(res => res.at(0))
			const scheduleObject = new Schedule({
				_id: new mongoose.mongo.ObjectId(),
				owner: new mongoose.mongo.ObjectId(),
				sections: generatedSchedule,
			})
			const toDelete = await scheduleObject.save()
			const wasAdded = await Schedule.findById(toDelete._id).then(res => res !== undefined && res !== null)
			if (!wasAdded)
				assert(false)

			await deleteSection({
				query: {
					nrc: toAddSectionMath.nrc
				}
			})

			assert(await Schedule.findById(toDelete._id).then(res => res === undefined || res === null))
		})


		it("If a subject is deleted, the schedule should be deleted", async function() {
			this.timeout(10000)
			const generatedSchedule = await generateSchedules({
				query: {
					nrcs: "1,2,3"
				}
			}).then(res => res.at(0))
			const scheduleObject = new Schedule({
				_id: new mongoose.mongo.ObjectId(),
				owner: new mongoose.mongo.ObjectId(),
				sections: generatedSchedule,
			})
			const toDelete = await scheduleObject.save()
			const wasAdded = await Schedule.findById(toDelete._id).then(res => res !== undefined && res !== null)
			if (!wasAdded)
				assert(false)

			await deleteSubject({
				query: {
					name: subjectMath.name
				}
			})

			assert(await Schedule.findById(toDelete._id).then(res => res === undefined || res === null))
		})
	})
})
