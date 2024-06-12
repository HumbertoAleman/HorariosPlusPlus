import assert from "assert"
import EventController from "../src/routes/event/EventController.js"
import Event from "../src/models/event.model.js"

describe("Events CRUD", () => {
	// NOTE: CREATE EVENTS
	describe("Create Events", () => {
		it("Create an event", async () => {
			const createdEvent = await EventController.newEvent({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 7,
					endMinute: 30
				}
			})
			assert(await Event.checkIfIdExists(createdEvent._id))
		})
	})

	// NOTE: READ EVENTS
	describe("Read Events", () => {
		let toRead
		beforeEach(async () => {
			toRead = await EventController.newEvent({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 7,
					endMinute: 30
				}
			})
		})

		it("Read an event", async () => {
			assert(await EventController.getEvents().then(res => res.at(0)._id.equals(toRead._id)))
		})
	})


	// NOTE: UPDATE EVENTS
	describe("Update Events", () => {
		let toUpdate
		beforeEach(async () => {
			toUpdate = await EventController.newEvent({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 7,
					endMinute: 30
				}
			})
		})

		it("Update an event", async () => {
			const updatedEvent = await EventController.updateEvent({
				query: {
					oldDay: 1,
					oldStartHour: 6,
					oldStartMinute: 0,
					oldEndHour: 7,
					oldEndMinute: 30,

					newDay: 2,
					newStartHour: 10,
					newStartMinute: 15,
					newEndHour: 11,
					newEndMinute: 45,
				}
			})
			assert(
				toUpdate._id.equals(updatedEvent._id) &&
				updatedEvent.day === 2 &&
				updatedEvent.start.hour === 10 &&
				updatedEvent.start.minute === 15 &&
				updatedEvent.end.hour === 11 &&
				updatedEvent.end.minute === 45
			)
		})
	})

	// NOTE: DELETE EVENTS
	describe("Delete Events", () => {
		let toDelete
		beforeEach(async () => {
			toDelete = await EventController.newEvent({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 7,
					endMinute: 30
				}
			})
		})

		it("Delete an event", async () => {
			const deletedData = await EventController.deleteEvent({
				query: {
					day: 1,
					startHour: 6,
					startMinute: 0,
					endHour: 7,
					endMinute: 30
				}
			})
			assert(deletedData._id.equals(toDelete._id) && await Event.checkIfIdExists(toDelete._id).then(res => !res))
		})
	})
})
