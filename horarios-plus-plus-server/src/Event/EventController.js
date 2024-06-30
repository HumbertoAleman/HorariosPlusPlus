import Event from "../Modelos/event.model.js"

export default class EventController {
	static routeToApp(app) {
		app.get("/api/events/newEvent", (req, res) => EventController.#newEvent(req, res))
		app.get("/api/events/getEvents", (req, res) => EventController.#getEvents(req, res))
		app.get("/api/events/updateEvent", (req, res) => EventController.#updateEvent(req, res))
		app.get("/api/events/deleteEvent", (req, res) => EventController.#deleteEvent(req, res))
	}

	// NOTE: CREATE
	static async #newEvent(req, res) {
		const response = await Event.save(
			req?.query?.day,
			req?.query?.name,
			{
				hour: req?.query?.startHour,
				minute: req?.query?.startMinute,
			},
			{
				hour: req?.query?.endHour,
				minute: req?.query?.endMinute,
			},
		)
		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}

	// NOTE: READ
	static async #getEvents(req, res) {
		const response = await Event.get(req?.query?.day)
		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}

	// NOTE: UPDATE
	static async #updateEvent(req, res) {
		const response = await Event.update(
			req?.query?.oldDay,
			req?.query?.oldName,
			{
				minute: req?.query?.oldStartMinute,
				hour: req?.query?.oldStartHour
			},
			{
				minute: req?.query?.oldEndMinute,
				hour: req?.query?.oldEndHour
			},

			req?.query?.newDay ?? req?.query?.oldDay,
			req?.query?.newName ?? req?.query?.oldName,
			{
				minute: req?.query?.newStartMinute ?? req?.query?.oldStartMinute,
				hour: req?.query?.newStartHour ?? req?.query?.oldStartHour
			},
			{
				minute: req?.query?.newEndMinute ?? req?.query?.oldEndMinute,
				hour: req?.query?.newEndHour ?? req?.query?.oldEndHour
			},
		)
		if ("code" in response)
			console.error(response)

		res?.send(response)
		return response
	}

	// NOTE: DELETE
	static async #deleteEvent(req, res) {
		const response = await Event.delete(
			req?.query?.day,
			req?.query?.name,
			{
				minute: req?.query?.startMinute,
				hour: req?.query?.startHour
			},
			{
				minute: req?.query?.endMinute,
				hour: req?.query?.endHour
			},
		)
		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}
}

