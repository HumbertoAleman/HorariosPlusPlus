import Schedule from "../Modelos/schedule.model.js"

export default class ScheduleController {
	// NOTE: CREATE
	static async generateSchedules(req, res) {
		const response = await Schedule.generateSchedules(
			req?.query?.nrcs
		)
		if ("code" in response)
			console.log(response)

		res?.send(response)
		return response
	}

	// NOTE: DELETE
	static async deleteSchedule(req, res) {
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

