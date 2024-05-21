import assert from "assert"

import Subject from "../src/models/subject.model.js"

// Function imports
import newSubject from "../src/routes/subject/subject.new_subject.js"
import newSection from "../src/routes/section/section.new_section.js"
import deleteSubject from "../src/routes/subject/subject.delete_subject.js"
import Section from "../src/models/section.model.js"
import getSubjects from "../src/routes/subject/subject.get_subjects.js"
import getSubject from "../src/routes/subject/subject.get_subject.js"
import updateSubject from "../src/routes/subject/subject.update_subject.js"

describe("Subject CRUD", () => {
	// NOTE: CREATE SUBJECTS 
	describe("Create Subjects", () => {

		it("Create a new subject with no arguments", async () => {
			assert(await newSubject().then(res => res.name === "New Subject 0"))
		})

		it("Create a new subject with no arguments, with subjects already in", async () => {
			await newSubject()
			await newSubject()
			await newSubject()
			await newSubject()
			assert(await newSubject().then(res => res.name === "New Subject 4"))
		})

		it("Create new subject with name", async () => {
			await newSubject({ query: { name: "New Name" } })
			assert(await Subject.exists({ name: "New Name" }).then(res => res !== null))
		})

		it("Throw when adding subjects with duplicate names", async () => {
			await newSubject({ query: { name: "Dupe Name" } })
			assert(await newSubject({ query: { name: "Dupe Name" } })
				.then(res => res.message === "ERROR cannot add duplicate names"))
		})
	})

	// NOTE: READ SUBJECTS
	describe("Read Subjects", () => {
		it("Get Subject by Name", async () => {
			await newSubject({ query: { name: "New Subject 1" } })
			assert(await getSubject({ query: { name: "New Subject 1" } })
				.then(res => res.name === "New Subject 1"))
		})

		it("Get all subjects", async () => {
			await newSubject({ query: { name: "New Subject 1" } })
			await newSubject({ query: { name: "New Subject 2" } })
			await newSubject({ query: { name: "New Subject 3" } })
			assert(await getSubjects()
				.then(res => res.every(subject => subject.name.startsWith("New Subject")))
			)
		})

		it("Throw if subject does not exist", async () => {
			assert(await getSubject({ query: { name: "A subject" } })
				.then(res => res.message === "ERROR subject with name A subject was not found"))
		})

		it("Throw if subjectName is undefined", async () => {
			assert(await getSubject({ query: { name: undefined } })
				.then(res => res.message === "ERROR subjectName is undefined"))
		})
	})

	// NOTE: UPDATE SUBJECTS
	describe("Update Subjects", () => { 
		let toUpdate
		beforeEach(async () => {
			toUpdate = await newSubject({ query: { name: "to update" } })
		})

		it("Update name of subject", async () => {
			assert(await updateSubject({
				query: { oldName: toUpdate.name, newName: "updated" }
			}).then(res => res._id.equals(toUpdate._id) && res.name === "updated"))
		})

		it("Throw when oldName is undefined", async () => {
			assert(await updateSubject({
				query: { oldName: undefined, newName: "updated" }
			}).then(res => res.message === "ERROR oldName is undefined"))
		})

		it("Throw when newName is undefined", async () => {
			assert(await updateSubject({
				query: { oldName: toUpdate.name, newName: undefined }
			}).then(res => res.message === "ERROR newName is undefined"))
		})

		it("Throw when subject is not found", async () => {
			assert(await updateSubject({
				query: { oldName: "fail", newName: "updated" }
			}).then(res => res.message === "ERROR subject with name fail was not found"))
		})
	})

	// NOTE: DELETE SUBJECTS 
	describe("Delete Subjects", () => {
		let toDelete
		beforeEach(async () => {
			toDelete = await newSubject({ query: { name: "to delete" } })
		})

		it("Delete subject by Name", async () => {deleteSubject
			await deleteSubject({
				query: {
					name: toDelete.name,
				}
			})

			assert(await Section.exists({ name: toDelete.name }).then(res => res === null))
		})

		it("Throw if name is undefined", async () => {
			assert(await deleteSubject({ query: { name: undefined } })
				.then(res => res.message === "ERROR subjectName is undefined"))
		})

		it("Throw when deleting a name that doesnt exist", async () => {
			assert(await deleteSubject({
				query: { name: "Oogly oo", }
			}).then(res => res.message === "ERROR subject does not exist"))
		})

		it("Assure that sections underneath subject are deleted", async () => {
			const toDeleteSection = await newSection({
				query: { subjectName: toDelete.name }
			})

			await deleteSubject({
				query: { name: toDelete.name, }
			})

			assert(await Section.exists(toDeleteSection)
				.then(res => res === null))
		})
	})
})
