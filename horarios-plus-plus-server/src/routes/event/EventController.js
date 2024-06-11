import mongoose from "mongoose"
import Event from "../../models/event.model.js"

export default class EventController {
	static #hoursIntersect(start_x, end_x, start_y, end_y) {
		return ((start_x.minute + start_x.hour * 60 < end_y.minute + end_y.hour * 60) &&
			(start_y.minute + start_y.hour * 60 < end_x.minute + end_x.hour * 60))
	}

	// NOTE: CREATE
	static async newEvent(req, res) {
		const eventDay = req?.query?.day
		const eventStart = {
			minute: req?.query?.startMinute,
			hour: req?.query?.startHour
		}
		const eventEnd = {
			minute: req?.query?.endMinute,
			hour: req?.query?.endHour
		}

		if (eventStart.minute === undefined || eventStart.hour === undefined) {
			res?.send({ message: "ERROR eventStart is undefined", code: 0 })
			return { message: "ERROR eventStart is undefined", code: 0 }
		}

		if (eventEnd.minute === undefined || eventEnd.hour === undefined) {
			res?.send({ message: "ERROR eventEnd is undefined", code: 0 })
			return { message: "ERROR eventEnd is undefined", code: 0 }
		}

		if (eventStart.hour * 60 + eventStart.minute >= eventEnd.hour * 60 + eventEnd.minute) {
			res?.send({ message: "ERROR start cannot be equal to/before end", code: 0 })
			return { message: "ERROR start cannot be equal to/before end", code: 0 }
		}

		if (eventDay === undefined) {
			res?.send({ message: "ERROR eventDay is undefined", code: 0 })
			return { message: "ERROR eventDay is undefined", code: 0 }
		}

		let eventList = await Event.find({})
		if (eventList.some(event => event.day === eventDay && EventController.#hoursIntersect(eventStart, eventEnd, event.start, event.end))) {
			res?.send({ message: "ERROR events collide", code: 0 })
			return { message: "ERROR events collide", code: 0 }
		}

		let newEvent = new Event({
			_id: new mongoose.mongo.ObjectId(),
			day: eventDay,
			start: {
				hour: eventStart.hour,
				minute: eventStart.minute,
			},
			end: {
				hour: eventEnd.hour,
				minute: eventEnd.minute,
			},
		})

		const savedEvent = await newEvent.save()
		if (savedEvent !== newEvent) {
			// This error sould never happen
			res?.send({ message: "ERROR an unexpected error has occurred", code: 0 })
			return { message: "ERROR an unexpected error has occurred", code: 0 }
		}

		res?.send(savedEvent)
		return savedEvent
	}

	// NOTE: READ
	static async getEvents(req, res) {
		const eventDay = req?.query?.day
		const filter = {}
		if (eventDay !== undefined) filter.day = eventDay

		const events = await Event.find(filter)

		res?.send(events)
		return events
	}

	// NOTE: UPDATE
	static async updateEvent(req, res) {
		const oldEventDay = req?.query?.oldDay
		const oldEventStart = {
			minute: req?.query?.oldStartMinute,
			hour: req?.query?.oldStartHour
		}
		const oldEventEnd = {
			minute: req?.query?.oldEndMinute,
			hour: req?.query?.oldEndHour
		}

		if (oldEventStart.minute === undefined || oldEventStart.hour === undefined) {
			res?.send({ message: "ERROR oldEventStart is undefined", code: 0 })
			return { message: "ERROR oldEventStart is undefined", code: 0 }
		}

		if (oldEventEnd.minute === undefined || oldEventEnd.hour === undefined) {
			res?.send({ message: "ERROR oldEventEnd is undefined", code: 0 })
			return { message: "ERROR oldEventEnd is undefined", code: 0 }
		}

		if (oldEventDay === undefined) {
			res?.send({ message: "ERROR oldEventDay is undefined", code: 0 })
			return { message: "ERROR oldEventDay is undefined", code: 0 }
		}

		const newEventDay = req?.query?.newDay ?? oldEventDay
		const newEventStart = {
			minute: req?.query?.newStartMinute ?? oldEventStart.minute,
			hour: req?.query?.newStartHour ?? oldEventStart.hour
		}
		const newEventEnd = {
			minute: req?.query?.newEndMinute ?? oldEventEnd.minute,
			hour: req?.query?.newEndHour ?? oldEventEnd.hour
		}

		if ((newEventStart.hour * 60 + newEventStart.minute) >=
			(newEventEnd.hour * 60 + newEventEnd.minute)) {
			res?.send({ message: "ERROR start cannot be equal to/before end", code: 0 })
			return { message: "ERROR start cannot be equal to/before end", code: 0 }
		}

		const oldEvent = await Event.findOne({
			day: oldEventDay,
			start: oldEventStart,
			end: oldEventEnd,
		})

		if (oldEvent === undefined || oldEvent === null) {
			res?.send({ message: "ERROR event was not found", code: 0 })
			return { message: "ERROR was not found", code: 0 }
		}

		let eventList = await Event.find({})
		if (eventList.some(event => !event._id.equals(oldEvent._id) && event.day === newEventDay && EventController.#hoursIntersect(newEventStart, newEventEnd, event.start, event.end))) {
			res?.send({ message: "ERROR events collide", code: 0 })
			return { message: "ERROR events collide", code: 0 }
		}

		const updatedEvent = await Event.findByIdAndUpdate(oldEvent._id, {
			day: newEventDay,
			start: newEventStart,
			end: newEventEnd,
		}, { new: true }) // we set the new flag to return the updated version

		res?.send(updatedEvent)
		return updatedEvent
	}

	// NOTE: DELETE
	static async deleteEvent(req, res) {
		const eventDay = req?.query?.day
		const eventStart = {
			minute: req?.query?.startMinute,
			hour: req?.query?.startHour
		}
		const eventEnd = {
			minute: req?.query?.endMinute,
			hour: req?.query?.endHour
		}

		if (eventStart.minute === undefined || eventStart.hour === undefined) {
			res?.send({ message: "ERROR eventStart is undefined", code: 0 })
			return { message: "ERROR eventStart is undefined", code: 0 }
		}

		if (eventEnd.minute === undefined || eventEnd.hour === undefined) {
			res?.send({ message: "ERROR eventEnd is undefined", code: 0 })
			return { message: "ERROR eventEnd is undefined", code: 0 }
		}

		if (eventDay === undefined) {
			res?.send({ message: "ERROR eventDay is undefined", code: 0 })
			return { message: "ERROR eventDay is undefined", code: 0 }
		}

		const deletedData = await Event.findOneAndDelete({
			day: eventDay,
			start: eventStart,
			end: eventEnd,
		})

		if (deletedData === undefined || deletedData === null) {
			// This error should never happen
			res?.send({ message: "ERROR could not find event to delete", code: 0 })
			return { message: "ERROR could not find event to delete", code: 0 }
		}

		res?.send(deletedData)
		return deletedData
	}
}

