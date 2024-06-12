import Subject from "../../models/subject.model.js"
import SectionController from "../section/SectionController.js"

export default class SubjectController {
	// NOTE: CREATE
	static async newSubject(req, res) {
		const response = await Subject.save(req?.query?.name, undefined)
		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}

	// NOTE: READ
	static async getSubject(req, res) {
		const response = await Subject.get(req?.query?.name)
		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}

	// NOTE: UPDATE
	static async updateSubject(req, res) {
		const response = Subject.update(req?.query?.oldName, req?.query?.newName)
		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}

	// NOTE: DELETE
	static async deleteSubject(req, res) {
		const response = Subject.delete(req?.query?.name)
		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}
}
