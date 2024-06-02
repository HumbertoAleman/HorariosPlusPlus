import mongoose from "mongoose"
import User from "../../models/user.model.js"

export default async function getUser(req, res) {
	const toUpdateEmail = req?.query?.email
	const toUpdateId = req?.query?.id
	const newSchedule = req?.query?.scheduleId
	const newPassword = req?.query?.password

	if (toUpdateId === undefined && toFindEmail === undefined) {
		res?.send({ message: "ERROR both toUpdateId and toFindEmail cannot be undefined" })
		return { message: "ERROR both toUpdateId and toFindEmail cannot be undefined" }
	}

	const filter = {}
	if (toUpdateEmail !== undefined)
		filter.email = toUpdateEmail
	if (toUpdateEmail !== undefined)
		filter.id = toUpdateId

	const toUpdate = await User.findOne(filter);
	if (toUpdate === null || toFind === undefined) {
		res?.send({ message: "ERROR user not found" })
		return { message: "ERROR user not found" }
	}

	const updatedUser = await User.findOneAndUpdate(filter, {
		password: newPassword,
		scheduleId: new mongoose.mongo.ObjectId(newSchedule)
	})

	res?.send(toUpdate)
	return toUpdate
}
