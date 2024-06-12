import Schedule from "../../models/schedule.model.js"
import Section from "../../models/section.model.js"
import Session from "../../models/session.model.js";
import UserController from "../user/UserController.js";

export default class ScheduleController {
	static async #generateCombinations(sectionList, subjectCount) {
		function hoursIntersect(start_x, end_x, start_y, end_y) {
			return ((start_x.minute + start_x.hour * 60 < end_y.minute + end_y.hour * 60) &&
				(start_y.minute + start_y.hour * 60 < end_x.minute + end_x.hour * 60))
		}

		async function generateCombination(originalArray, passedArray, finalArray) {
			if (passedArray.length >= subjectCount) {
				if (finalArray.some(sectionFromArray =>
					passedArray.every(section =>
						sectionFromArray.some(otherSection => section.nrc === otherSection.nrc)
					))) return
				finalArray.push(passedArray)
				return
			}

			for (const element of originalArray) {
				// Avoid repeated elements
				if (passedArray.includes(element)) continue

				// If they belong in the same subject, remove
				if (passedArray.some(value => value.subject.equals(element.subject))) continue

				// Get all sessions from original list, concat new sessions, flatten
				let sessionList = passedArray.map(value => value.sessions).concat(element.sessions).flat()
				if (sessionList.length === 0) continue

				sessionList = await Promise.all(sessionList.map(id => Session.findById(id)))
				if (sessionList.some(x => sessionList.some(y => {
					return x !== y && x.day === y.day && hoursIntersect(x.start, x.end, y.start, y.end)
				}))) continue

				await generateCombination(originalArray, passedArray.concat(element), finalArray)
			}
		}

		const returnArray = []
		await generateCombination(sectionList, [], returnArray)
		return returnArray
	}

	// NOTE: CREATE
	static async generateSchedules(req, res) {
		const nrcs = req?.query?.nrcs

		if (nrcs === undefined) {
			res?.send({ message: "ERROR nrcs is undefined", code: 0 })
			return { message: "ERROR nrcs is undefined", code: 0 }
		}
		const splitNrcs = nrcs.split(",")

		let sectionList = []
		for (const nrc of splitNrcs) {
			sectionList.push(Section.find({ nrc: nrc }))
		}
		sectionList = await Promise.all(sectionList).then(res => res.flat())

		const schedules = ScheduleController.#generateCombinations(sectionList, [...new Set(sectionList.map(section => section.subject.toString()))].length)

		res?.send(schedules)
		return schedules
	}

	// NOTE: DELETE
	static async deleteSchedule(req, res) {
		const mongoId = req?.query?.id
		if (mongoId !== undefined) {
			const foundSchedule = await Schedule.findById(mongoId)
			if (foundSchedule === null || foundSchedule === undefined) {
				res?.send({ message: "ERROR mongoId provided but schedule not found", code: 0 })
				return { message: "ERROR mongoId provided but schedule not found", code: 0 }
			}
			await Schedule.findByIdAndDelete(mongoId)

			res?.send(foundSchedule)
			return foundSchedule
		}

		const ownerId = req?.query?.ownerId
		const ownerEmail = req?.query?.ownerEmail

		if (ownerId === undefined && ownerEmail === undefined) {
			res?.send({ message: "ERROR both ownerId and ownerEmail cannot be undefined" })
			return { message: "ERROR both ownerId and ownerEmail cannot be undefined" }
		}

		const filter = {}
		if (ownerEmail !== undefined)
			filter.email = ownerEmail
		if (ownerEmail !== undefined)
			filter.id = ownerId

		const foundUser = await UserController.getUser({ query: filter })
		if (foundUser.schedule === undefined || foundUser.schedule === null) {
			res?.send({ message: "ERROR this user does not have a schedule" })
			return { message: "ERROR this user does not have a schedule" }
		}
		const deletedSchedule = await Schedule.findByIdAndDelete(foundUser.schedule)

		res?.send(deletedSchedule)
		return deletedSchedule
	}
}

