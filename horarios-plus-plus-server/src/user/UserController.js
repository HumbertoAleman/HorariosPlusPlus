import User from "../Modelos/user.model.js"

export default class UserController {
	// NOTE: CREATE
	static async newUser(req, res) {
		const response = await User.save(
			req?.query?.type,
			req?.query?.email,
			req?.query?.password,
			req?.query?.id,
		)

		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}

	// NOTE: READ
	static async getUser(req, res) {
		let response

		const userEmail = req?.query?.email
		if (userEmail !== undefined && response === undefined)
			response = await User.getByEmail(userEmail)

		if (response === undefined)
			response = await User.getById(req?.query?.id)

		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}

	static async updateUser(req, res) {
		const response = await User.update(
			req?.query?.id,
			req?.query?.schedule,
			req?.query?.password,
			req?.query?.email,
			req?.query?.type,
		)
		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}

	// NOTE: DELETE
	static async deleteUser(req, res) {
		const response = await User.delete(req?.query?.id)
		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}
}
