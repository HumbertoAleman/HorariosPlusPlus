import Section from "../Modelos/section.model.js"

export default class SectionController {
	static routeToApp(app) {
		app.get("/api/sections/newSection", (req, res) => SectionController.#newSection(req, res))
		app.get("/api/sections/getSection", (req, res) => SectionController.#getSection(req, res))
		app.get("/api/sections/updateSection", (req, res) => SectionController.#updateSection(req, res))
		app.get("/api/sections/deleteSection", (req, res) => SectionController.#deleteSection(req, res))
	}

	// NOTE: CREATE
	static async #newSection(req, res) {
		const response = await Section.save(
			req?.query?.nrc,
			req?.query?.teacher,
			req?.query?.sessions,
			req?.query?.subjectName
		)

		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}

	// NOTE: READ
	static async #getSection(req, res) {
		let response = undefined

		const subjectId = req?.query?.subject
		if (subjectId !== undefined)
			response = await Section.getFromSubject(subjectId)

		const sectionId = req?.query?.id
		if (sectionId !== undefined && response === undefined)
			response = await Section.getById(sectionId)

		if (response === undefined)
			response = await Section.getByNrc(req?.query?.nrc)

		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}

	// NOTE: UPDATE
	static async #updateSection(req, res) {
		const response = await Section.update(
			req?.query?.oldNrc,
			req?.query?.newNrc,
			req?.query?.newTeacher
		)

		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}

	// NOTE: DELETE
	static async #deleteSection(req, res) {
		const response = req?.query?.id !== undefined
			? await Section.deleteById(req?.query?.id)
			: await Section.delete(req?.query?.nrc)
		if ("code" in response)
			console.log(response.message)

		res?.send(response)
		return response
	}
}
