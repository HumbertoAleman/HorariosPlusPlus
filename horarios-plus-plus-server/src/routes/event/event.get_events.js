import Event from "../../models/event.model.js"

export default async function getEvents(req, res) {
	const eventDay = req?.query?.day
	const filter = {}
	if (eventDay !== undefined) filter.day = eventDay

	const events = await Event.find(filter)

	res?.send(events)
	return events
}
