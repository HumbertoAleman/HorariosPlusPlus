import mongoose from "mongoose"
import User from "./user.model.js"

export default class Schedule {
	static #schema = new mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		owner: { type: mongoose.Schema.Types.ObjectId, require: true, unique: true },
		sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
	})

	static #model = mongoose.model("Schedule", Schedule.#schema)

	static findByIdAndDelete = async (id) => await Schedule.#model.findByIdAndDelete(id)


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
	static generateSchedules = async (nrcs) => {
		if (nrcs === undefined)
			return { message: "ERROR nrcs is undefined", code: 0 }

		let sectionList = []
		for (const nrc of nrcs.split(","))
			sectionList.push(Section.find({ nrc: nrc }))
		sectionList = await Promise.all(sectionList).then(res => res.flat())

		const schedules = Schedule.#generateCombinations(sectionList, [...new Set(sectionList.map(section => section.subject.toString()))].length)

		return schedules
	}

	static deleteById = async (id) => {
		if (id !== undefined)
			return { message: "" }

		const foundSchedule = await Schedule.findById(id)
		if (foundSchedule === null || foundSchedule === undefined)
			return { message: "ERROR mongoId provided but schedule not found", code: 0 }
		await Schedule.findByIdAndDelete(id)

		return foundSchedule
	}

	static deleteByOwnerId = async (ownerId) => {
		if (ownerId === undefined)
			return { message: "ERROR ownerId cannot be undefined" }

		if (await User.checkIfExists(ownerId).then(res => !res))
			return { message: "ERROR user with id " + ownerId + " was not found", code: 0 }
		if (foundUser.schedule === undefined || foundUser.schedule === null)
			return { message: "ERROR this user does not have a schedule", code: 0 }
		const deletedSchedule = await Schedule.findByIdAndDelete(foundUser.schedule)

		return deletedSchedule
	}
}

