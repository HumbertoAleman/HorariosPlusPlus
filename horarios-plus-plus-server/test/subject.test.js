import assert from "assert"
import Subject from "../src/models/subject.model.js"
import SubjectController from "../src/routes/subject/SubjectController.js"

describe("Subject CRUD", () => {
	// NOTE: CREATE SUBJECTS 
	describe("Create Subjects", () => {
		it("Create a new subject with no arguments", async () => {
			await SubjectController.newSubject()
			assert(await Subject.checkIfExists("Subject 1"))
		})
	})

	// NOTE: READ SUBJECTS 
	describe("Get Subjects", () => {
		let toRead
		beforeEach(async () => {
			toRead = await SubjectController.newSubject()
		})

		it("Read subject", async () => {
			assert(await SubjectController.getSubject({ query: { name: toRead.name } }).then(res => res._id.equals(toRead._id)))
		})
	})

	// NOTE: UPDATE SUBJECTS 
	describe("Update a Subject", () => {
		let toUpdate
		beforeEach(async () => {
			toUpdate = await SubjectController.newSubject()
		})

		it("Update subject", async () => {
			assert(await SubjectController.updateSubject({ query: { oldName: toUpdate.name, newName: "New" } }).then(res => res._id.equals(toUpdate._id) && res.name === "New"))
		})
	})

	// NOTE: DELETE SUBJECTS 
	describe("Delete a Subject", () => {
		let toDelete
		beforeEach(async () => {
			toDelete = await SubjectController.newSubject()
		})

		it("Delete subject", async () => {
			assert(await SubjectController.deleteSubject({ query: { name: toDelete.name } }).then(async res => await Subject.checkIfExists(res.name).then(res => !res)))
		})
	})
})
