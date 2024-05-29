import assert from "assert"
import newEvent from "../src/routes/event/event.new_event.js"

describe("Events CRUD", () => {
	// NOTE: CREATE EVENTS
	describe("Create Events", () => {
		it("Create Event", async () => {
			assert(await newEvent({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 7,
					endMinute: 30,
				}
			}).then(res =>
				res.day === 1 &&
				res.start.hour === 6 &&
				res.start.minute === 0 &&
				res.end.hour === 7 &&
				res.end.minute === 30))
		})

		it("Throw when event start is undefined", async () => {
			assert(await newEvent({
				query: {
					day: 1,
					endHour: 7,
					endMinute: 30,
				}
			}).then(res => res.message === "ERROR eventStart is undefined"))
		})


		it("Throw when event end is undefined", async () => {
			assert(await newEvent({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
				}
			}).then(res => res.message === "ERROR eventEnd is undefined"))
		})

		it("Throw when event day is undefined", async () => {
			assert(await newEvent({
				query: {
					startHour: 6,
					startMinute: 0,
					endHour: 7,
					endMinute: 30,
				}
			}).then(res => res.message === "ERROR eventDay is undefined"))
		})


		it("Throw when event start is after event end", async () => {
			assert(await newEvent({
				query: {
					day: 1,
					startHour: 8,
					startMinute: 0,
					endHour: 7,
					endMinute: 30,
				}
			}).then(res => res.message === "ERROR start cannot be equal to/before end"))
		})


		it("Throw when two events collide", async () => {
			await newEvent({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 7,
					endMinute: 30,
				}
			})

			assert(await newEvent({
				query: {
					day: 1,
					startHour: 7,
					startMinute: 0,
					endHour: 8,
					endMinute: 30,
				}
			}).then(res => res.message === "ERROR events collide"))
		})
	})

	// NOTE: READ EVENTS
	describe("Read Events", () => {

	})

	// NOTE: UPDATE EVENTS
	describe("Update Events", () => {

	})

	// NOTE: DELETE EVENTS
	describe("Delete Events", () => {

	})
})
