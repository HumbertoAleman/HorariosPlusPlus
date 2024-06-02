import Schedule from "../../models/schedule.model"
import getUser from "../user/user.get_user"

export default async function deleteSchedule(req, res) {
	const mongoId = req?.query?.id
	if (mongoId !== undefined) {
		const foundSchedule = await Schedule.findById(mongoId)
		if (foundSchedule === null || foundSchedule === undefined) {
			res?.send({ message: "ERROR mongoId provided but schedule not found", code: 0 })
			return { message: "ERROR mongoId provided but schedule not found", code: 0 }
		}
		await Schedule.findByIdAndDelete(mongoId)

		res?.send(foundSchedule)
		return foundSchedule
	}

	const ownerId = req?.query?.ownerId
	const ownerEmail = req?.query?.ownerEmail

	if (ownerId === undefined && ownerEmail === undefined) {
		res?.send({ message: "ERROR both ownerId and ownerEmail cannot be undefined" })
		return { message: "ERROR both ownerId and ownerEmail cannot be undefined" }
	}

	const filter = {}
	if (ownerEmail !== undefined)
		filter.email = ownerEmail
	if (ownerEmail !== undefined)
		filter.id = ownerId

	const foundUser = await getUser({ query: filter })
	if (foundUser.schedule === undefined || foundUser.schedule === null) {
		res?.send({ message: "ERROR this user does not have a schedule" })
		return { message: "ERROR this user does not have a schedule" }
	}
	const deletedSchedule = await Schedule.findByIdAndDelete(foundUser.schedule)

	res?.send(deletedSchedule)
	return deletedSchedule
}
