import Schedule from "../Modelos/schedule.model.js"

export default class ScheduleController {
	static routeToApp(app) {
		app.get("/api/schedules/assignSchedule", (req, res) => ScheduleController.#assignSchedule(req, res))
		app.get("/api/schedules/getFromUser", (req, res) => ScheduleController.#getFromUser(req, res))
		app.get("/api/schedules/generateSchedules", (req, res) => ScheduleController.#generateSchedules(req, res))
		app.get("/api/schedules/deleteSchedule", (req, res) => ScheduleController.#deleteSchedule(req, res))
	}

	// NOTE: CREATE
	static async #generateSchedules(req, res) {
		const response = await Schedule.generateSchedules(
			req?.query?.nrcs
		)
		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}

	static async #getFromUser(req, res) {
		const response = await Schedule.getScheduleFromUser(req?.query?.cedula)
		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}

	static async #assignSchedule(req, res) {
		const response = await Schedule.assignSchedule(req?.query?.cedula, req?.query?.ids)
		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}

	// NOTE: DELETE
	static async #deleteSchedule(req, res) {
		const ownerId = req?.query?.ownerId
		const response = ownerId === undefined
			? await Schedule.deleteById(id)
			: await Schedule.deleteByOwnerId(ownerId)
		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}
}

