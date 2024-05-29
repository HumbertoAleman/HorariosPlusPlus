import assert from "assert"
import newEvent from "../src/routes/event/event.new_event.js"
import getEvents from "../src/routes/event/event.get_events.js"
import updateEvent from "../src/routes/event/event.update_event.js"

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
		let toRead
		let toReadDifferent
		beforeEach(async () => {
			toRead = await newEvent({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 7,
					endMinute: 30,
				}
			})
			toReadDifferent = await newEvent({
				query: {
					day: 2,
					startHour: 6,
					startMinute: 0,
					endHour: 7,
					endMinute: 30,
				}
			})
		})

		it("Read event from database", async () => {
			assert(await getEvents()
				.then(res => [toRead, toReadDifferent]
					.every(toread => res.some(fromDb => fromDb._id.equals(toread._id)))
				))
		})

		it("Read read event with specific day", async () => {
			assert(await getEvents({ query: { day: 1 } })
				.then(res => res.some(event => event._id.equals(toRead._id)) && !res.some(event => event._id.equals(toReadDifferent._id))
				))
		})
	})

	// NOTE: UPDATE EVENTS
	describe("Update Events", () => {
		let toUpdate
		beforeEach(async () => {
			toUpdate = await newEvent({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 7,
					endMinute: 30,
				}
			})
		})

		it("Update event day", async () => {
			const newDay = 2
			assert(await updateEvent({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				newDay: newDay
			}}).then(res => res._id.equals(toUpdate._id) && res.day === newDay))
		})

		it("Update start minutes", async () => {
			const newStartMinutes = 30
			assert(await updateEvent({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				newStartMinute: newStartMinutes
			}}).then(res => res._id.equals(toUpdate._id) && res.start.minute === newStartMinutes))
		})

		it("Update start hour", async () => {
			const newStartHours = 7
			assert(await updateEvent({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				newStartHour: newStartHours
			}}).then(res => res._id.equals(toUpdate._id) && res.start.hour === newStartHours))
		})

		it("Update end minutes", async () => {
			const newEndMinutes = 30
			assert(await updateEvent({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				newEndMinute: newEndMinutes
			}}).then(res => res._id.equals(toUpdate._id) && res.end.minute === newEndMinutes))
		})

		it("Update end hour", async () => {
			const newEndHour = 7
			assert(await updateEvent({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				newEndHour: newEndHour
			}}).then(res => res._id.equals(toUpdate._id) && res.end.hour === newEndHour))
		})

		it("Throw if new start is ahead of old end", async () => {
			assert(await updateEvent({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				newStartHour: 10,
				newStartMinute: 0
			}}).then(res => res.message === "ERROR start cannot be equal to/before end"))
		})

		it("Throw if new end is behind of old start", async () => {
			assert(await updateEvent({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
				newEndHour: 6,
				newEndMinute: 0
			}}).then(res => res.message === "ERROR start cannot be equal to/before end"))
		})

		it("Throw if oldDay is undefined", async () => {
			assert(await updateEvent({ query: {
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
			}}).then(res => res.message === "ERROR oldEventDay is undefined"))
		})


		it("Throw if oldEventStart is undefined", async () => {
			assert(await updateEvent({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
			}}).then(res => res.message === "ERROR oldEventStart is undefined"))
		})

		it("Throw if oldEventEnd is undefined", async () => {
			assert(await updateEvent({ query: {
				oldDay: toUpdate.day,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,
			}}).then(res => res.message === "ERROR oldEventEnd is undefined"))
		})

		it("Throw when event collides with another event", async () => {
			await newEvent({
				query: {
					day: 1,
					startHour: 9,
					startMinute: 0,
					endHour: 10,
					endMinute: 0,
				}
			})

			assert(await updateEvent({ query: {
				oldDay: toUpdate.day,
				oldEndMinute: toUpdate.end.minute,
				oldEndHour: toUpdate.end.hour,
				oldStartMinute: toUpdate.start.minute,
				oldStartHour: toUpdate.start.hour,

				newEndHour: 10,
				newEndMinute: 45,
				newStartHour: 9,
				newStartMinute: 45,
			}}).then(res => res.message === "ERROR events collide"))
		})
	})

	// NOTE: DELETE EVENTS
	describe("Delete Events", () => {

	})
})
