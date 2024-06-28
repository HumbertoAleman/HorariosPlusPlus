import mongoose from "mongoose"

export default class Event {
	static #hoursIntersect(start_x, end_x, start_y, end_y) {
		return ((start_x.minute + start_x.hour * 60 < end_y.minute + end_y.hour * 60) &&
			(start_y.minute + start_y.hour * 60 < end_x.minute + end_x.hour * 60))
	}

	static #schema = new mongoose.Schema({
		_id: mongoose.Schema.Types.ObjectId,
		start: {
			minute: { type: Number, required: true },
			hour: { type: Number, required: true },
		},
		end: {
			minute: { type: Number, required: true },
			hour: { type: Number, required: true },
		},
		day: { type: Number, required: true },
		name: { type: String, required: true },
	})

	static #model = mongoose.model("Event", Event.#schema)

	static getAll = async () => await Event.#model.find({})
	static findByDay = async (day) => await Event.#model.find({ day: day })
	static findByData = async (data) => await Event.#model.find(data)
	static findOne = async (data) => await Event.#model.findOne(data)

	static findByDataAndUpdate = async (data, newData) =>
		await Event.#model.findOneAndUpdate(data, newData, { new: true })
	static findByIdAndUpdate = async (id, newData) =>
		await Event.#model.findByIdAndUpdate(id, newData, { new: true })
	static findByDataAndDelete = async (data) =>
		await Event.#model.findOneAndDelete(data)

	static checkIfExists = async (data) => Event.#model.find(data).then(res => res !== undefined && res !== null)
	static checkIfIdExists = async (id) => Event.#model.findById(id).then(res => res !== undefined && res !== null)

	static dropDb = async () => await mongoose.connection.collections.events.drop()

	static save = async (eventDay, eventName, eventStart, eventEnd) => {
		if (eventName === undefined)
			return { message: "ERROR eventName is undefined", code: 0 }

		if (eventStart.minute === undefined || eventStart.hour === undefined)
			return { message: "ERROR eventStart is undefined", code: 0 }
		eventStart.hour = parseInt(eventStart.hour)
		eventStart.minute = parseInt(eventStart.minute)

		if (eventEnd.minute === undefined || eventEnd.hour === undefined)
			return { message: "ERROR eventEnd is undefined", code: 0 }
		eventEnd.hour = parseInt(eventEnd.hour)
		eventEnd.minute = parseInt(eventEnd.minute)

		if ((eventStart.hour * 60 + eventStart.minute) >= (eventEnd.hour * 60 + eventEnd.minute))
			return { message: "ERROR start cannot be equal to/before end", code: 0 }
		if (eventDay === undefined)
			return { message: "ERROR eventDay is undefined", code: 0 }
		eventDay = parseInt(eventDay)

		if (await Event.getAll()
			.then(res => res.some(event => event.day === eventDay &&
				Event.#hoursIntersect(eventStart, eventEnd, event.start, event.end))
			))
			return { message: "ERROR events collide", code: 0 }

		const newEvent = new Event.#model({
			_id: new mongoose.mongo.ObjectId(),
			day: eventDay,
			name: eventName,
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
		if (savedEvent !== newEvent)
			return { message: "ERROR an unexpected error has occurred", code: 0 }

		return savedEvent
	}

	static get = async (eventDay) => {
		const data = {}
		if (eventDay !== undefined)
			data.day = eventDay

		const events = await Event.findByData(data)

		return events
	}

	static update = async (oldEventDay, oldEventName, oldEventStart, oldEventEnd, newEventDay, newEventName, newEventStart, newEventEnd) => {
		if (oldEventStart.minute === undefined || oldEventStart.hour === undefined)
			return { message: "ERROR oldEventStart is undefined", code: 0 }
		oldEventStart.hour = parseInt(oldEventStart.hour)
		oldEventStart.minute = parseInt(oldEventStart.minute)

		if (oldEventEnd.minute === undefined || oldEventEnd.hour === undefined)
			return { message: "ERROR oldEventEnd is undefined", code: 0 }
		oldEventEnd.hour = parseInt(oldEventEnd.hour)
		oldEventEnd.minute = parseInt(oldEventEnd.minute)

		if (oldEventDay === undefined)
			return { message: "ERROR oldEventDay is undefined", code: 0 }
		oldEventDay = parseInt(oldEventDay)

		if (oldEventName === undefined)
			return { message: "ERROR oldEventName is undefined", code: 0 }
		console.log(oldEventName)
		console.log(newEventName)

		const oldEvent = await Event.findOne({
			day: oldEventDay,
			name: oldEventName,
			start: oldEventStart,
			end: oldEventEnd,
		})
		if (oldEvent === undefined || oldEvent === null)
			return { message: "ERROR event was not found", code: 0 }

		if ((newEventStart.hour * 60 + newEventStart.minute) >= (newEventEnd.hour * 60 + newEventEnd.minute))
			return { message: "ERROR start cannot be equal to/before end", code: 0 }

		if (await Event.getAll()
			.then(res => res.some(event => !event._id.equals(oldEvent._id) &&
				event.day === newEventDay &&
				EventController.#hoursIntersect(
					newEventStart, newEventEnd, event.start, event.end))))
			return { message: "ERROR events collide", code: 0 }

		const updatedEvent = await Event.findByIdAndUpdate(oldEvent._id, {
			day: newEventDay,
			name: newEventName,
			start: newEventStart,
			end: newEventEnd,
		})
		if (updatedEvent === undefined || updatedEvent === null)
			return { message: "ERROR event could not be updated", code: 0 }

		return updatedEvent
	}

	static delete = async (eventDay, eventName, eventStart, eventEnd) => {
		if (eventStart.minute === undefined || eventStart.hour === undefined)
			return { message: "ERROR eventStart is undefined", code: 0 }
		eventStart.hour = parseInt(eventStart.hour)
		eventStart.minute = parseInt(eventStart.minute)

		if (eventEnd.minute === undefined || eventEnd.hour === undefined)
			return { message: "ERROR eventEnd is undefined", code: 0 }
		eventEnd.hour = parseInt(eventEnd.hour)
		eventEnd.minute = parseInt(eventEnd.minute)

		if (eventDay === undefined)
			return { message: "ERROR eventDay is undefined", code: 0 }
		eventDay = parseInt(eventDay)

		if (eventName === undefined)
			return { message: "ERROR eventName is undefined", code: 0 }

		console.log(eventName)
		const deletedData = await Event.findByDataAndDelete({
			day: eventDay,
			name: eventName,
			start: eventStart,
			end: eventEnd,
		})
		if (deletedData === undefined || deletedData === null)
			return { message: "ERROR could not find event to delete", code: 0 }

		return deletedData
	}
}
