import Event from "../../models/event.model.js"

function hoursIntersect(start_x, end_x, start_y, end_y) {
	return ((start_x.minute + start_x.hour * 60 < end_y.minute + end_y.hour * 60) &&
		(start_y.minute + start_y.hour * 60 < end_x.minute + end_x.hour * 60))
}

export default async function updateEvent(req, res) {
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
	if (eventList.some(event => !event._id.equals(oldEvent._id) && event.day === newEventDay && hoursIntersect(newEventStart, newEventEnd, event.start, event.end))) {
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
