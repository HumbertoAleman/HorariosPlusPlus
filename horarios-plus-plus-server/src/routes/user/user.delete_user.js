import User from "../../models/user.model.js"

export default async function deleteUser(req, res) {
	const toDeleteEmail = req?.query?.email
	const toDeleteId = req?.query?.id

	if (toDeleteId === undefined && toDeleteEmail === undefined) {
		res?.send({ message: "ERROR both toDeleteId and toDeleteEmail cannot be undefined" })
		return { message: "ERROR both toDeleteId and toDeleteEmail cannot be undefined" }
	}

	const filter = {}
	if (toDeleteEmail !== undefined)
		filter.email = toDeleteEmail
	if (toDeleteEmail !== undefined)
		filter.id = toDeleteId

	const toDelete = await User.findOne(filter);
	if (toDelete === null || toDelete === undefined) {
		res?.send({ message: "ERROR user not found" })
		return { message: "ERROR user not found" }
	}

	const deletedUser = await User.findByIdAndDelete(toDelete._id)

	res?.send(deletedUser)
	return deletedUser
}
