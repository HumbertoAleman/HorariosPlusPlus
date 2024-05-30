import assert from "assert"
import newSubject from "../src/routes/subject/subject.new_subject.js"
import newSchedule from "../src/routes/schedule/schedule.new_schedule.js"
import newSection from "../src/routes/section/section.new_section.js"
import newSession from "../src/routes/session/session.new_session.js"

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
			assert(await newSchedule({
				query: {
					nrcs: "1,2,3"
				}
			}).then(res => {
				console.log(res)
			}))
		})
	})
})
