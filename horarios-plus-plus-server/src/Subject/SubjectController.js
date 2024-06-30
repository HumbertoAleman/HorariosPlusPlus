import Subject from "../Modelos/subject.model.js"

export default class SubjectController {
	static routeToApp(app) {
		app.get("/api/subjects/newSubject", (req, res) => SubjectController.#newSubject(req, res))
		app.get("/api/subjects/getSubject", (req, res) => SubjectController.#getSubject(req, res))
		app.get("/api/subjects/updateSubject", (req, res) => SubjectController.#updateSubject(req, res))
		app.get("/api/subjects/deleteSubject", (req, res) => SubjectController.#deleteSubject(req, res))
	}

	// NOTE: CREATE
	static async #newSubject(req, res) {
		const response = await Subject.save(req?.query?.name, undefined)
		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}

	// NOTE: READ
	static async #getSubject(req, res) {
		const response = await Subject.get(req?.query?.name)
		if ("code" in response) console.log(response.message)
		else console.log(response)

		res?.send(response)
		return response
	}

	// NOTE: UPDATE
	static async #updateSubject(req, res) {
		const response = Subject.update(req?.query?.oldName, req?.query?.newName)
		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}

	// NOTE: DELETE
	static async #deleteSubject(req, res) {
		const response = Subject.delete(req?.query?.name)
		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}
}
