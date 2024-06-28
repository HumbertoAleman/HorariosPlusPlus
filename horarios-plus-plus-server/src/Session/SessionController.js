import Session from "../Modelos/session.model.js"

export default class SessionController {
	static routeToApp(app) {
		app.get("/api/sessions/newSession", (req, res) => SessionController.#newSession(req, res))
		app.get("/api/sessions/getSessions", (req, res) => SessionController.#getSessions(req, res))
		app.get("/api/sessions/updateSession", (req, res) => SessionController.#updateSession(req, res))
		app.get("/api/sessions/deleteSession", (req, res) => SessionController.#deleteSession(req, res))
	}

	// NOTE: CREATE
	static async #newSession(req, res) {
		const response = await Session.save(
			req?.query?.day,
			{
				minute: req?.query?.startMinute,
				hour: req?.query?.startHour
			},
			{
				minute: req?.query?.endMinute,
				hour: req?.query?.endHour
			},
			req?.query?.nrc
		)

		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}

	// NOTE: READ
	static async #getSessions(req, res) {
		const response = await Session.get(req?.query?.nrc)
		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}

	// NOTE: UPDATE
	static async #updateSession(req, res) {
		const response = await Session.update(
			req?.query?.oldDay,
			{
				minute: req?.query?.oldStartMinute,
				hour: req?.query?.oldStartHour,
			},
			{
				minute: req?.query?.oldEndMinute,
				hour: req?.query?.oldEndHour,
			},

			req?.query?.newDay ?? req?.query?.oldDay,
			{
				minute: req?.query?.newStartMinute ?? req?.query?.oldStartMinute,
				hour: req?.query?.newStartHour ?? req?.query?.oldStartHour,
			},
			{
				minute: req?.query?.newEndMinute ?? req?.query?.oldEndMinute,
				hour: req?.query?.newEndHour ?? req?.query?.oldEndHour,
			},

			req?.query?.nrc,
		)

		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}

	// NOTE: DELETE
	static async #deleteSession(req, res) {
		const mongoId = req?.query?.id
		const response = mongoId !== undefined
			? await Session.deleteById()
			: await Session.delete(
				req?.query?.day,
				{
					minute: req?.query?.startMinute,
					hour: req?.query?.startHour
				},
				{
					minute: req?.query?.endMinute,
					hour: req?.query?.endHour
				},
				req?.query?.nrc
			)

		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}
}


