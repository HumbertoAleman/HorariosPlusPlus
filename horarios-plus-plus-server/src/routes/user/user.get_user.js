import User from "../../models/user.model.js"

export default async function getUser(req, res) {
	const toFindEmail = req?.query?.email
	const toFindId = req?.query?.id

	if (toFindId === undefined && toFindEmail === undefined) {
		res?.send({ message: "ERROR both toFindId and toFindEmail cannot be undefined" })
		return { message: "ERROR both toFindId and toFindEmail cannot be undefined" }
	}

	const filter = {}
	if (toFindEmail !== undefined)
		filter.email = toFindEmail
	if (toFindEmail !== undefined)
		filter.id = toFindId

	const toFind = await User.findOne(filter);
	if (toFind === null || toFind === undefined) {
		res?.send({ message: "ERROR user not found" })
		return { message: "ERROR user not found" }
	}

	res?.send(toFind)
	return toFind
}
