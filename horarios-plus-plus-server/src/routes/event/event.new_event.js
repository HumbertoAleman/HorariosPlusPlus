import mongoose from "mongoose"
import Event from "../../models/event.model.js"

function hoursIntersect(start_x, end_x, start_y, end_y) {
	return ((start_x.minute + start_x.hour * 60 < end_y.minute + end_y.hour * 60) &&
		(start_y.minute + start_y.hour * 60 < end_x.minute + end_x.hour * 60))
}

export default async function newEvent(req, res) {
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
	if (eventList.some(event => event.day === eventDay && hoursIntersect(eventStart, eventEnd, event.start, event.end))) {
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
