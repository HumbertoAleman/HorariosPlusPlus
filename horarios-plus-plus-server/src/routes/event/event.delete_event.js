import Event from "../../models/event.model.js"

export default async function deleteEvent(req, res) {
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
