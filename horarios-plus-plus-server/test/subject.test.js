import assert from "assert"

import Subject from "../src/models/subject.model.js"

// Function imports
import newSubject from "../src/routes/subject/subject.new_subject.js"
import newSection from "../src/routes/section/section.new_section.js"
import deleteSubject from "../src/routes/subject/subject.delete_subject.js"
import Section from "../src/models/section.model.js"
import getSubjects from "../src/routes/subject/subject.get_subjects.js"
import getSubject from "../src/routes/subject/subject.get_subject.js"

describe("Subject CRUD", () => {
	// NOTE: CREATE SUBJECTS 
	describe("Create Subjects", () => {

		it("Create a new subject with no arguments", async () => {
			await newSubject()
			assert(await Subject.exists({ name: "New Subject 0" }).then(res => res !== null))
		})

		it("Create a new subject with no arguments, with subjects already in", async () => {
			await newSubject()
			await newSubject()
			await newSubject()
			await newSubject()
			assert(await Subject.exists({ name: "New Subject 3" }).then(res => res !== null))
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
			await newSubject({ query: { name: "New Subject 1" }})
			assert(await getSubject({ query: { name: "New Subject 1" } })
				.then(res => res.name === "New Subject 1"))
		})

		it("Get all subjects", async () => {
			await newSubject({ query: { name: "New Subject 1" }})
			await newSubject({ query: { name: "New Subject 2" }})
			await newSubject({ query: { name: "New Subject 3" }})
			assert(await getSubjects()
			.then(res => res.every(subject => subject.name.startsWith("New Subject")))
			)
		})

		it("Throw if subject does not exist", async () => {
			assert(await getSubject({ query: { name: "A subject" } })
				.then(res => { console.log(res); return res; })
				.then(res => res.message === "ERROR subject with name A subject was not found"))
		})

		it("Throw if subjectName is undefined", async () => {
			assert(await getSubject({ query: { name: undefined } })
				.then(res => res.message === "ERROR subjectName is undefined"))
		})
	})

	// NOTE: DELETE SUBJECTS 
	describe("Delete Subjects", () => {
		let toDelete
		beforeEach(async () => {
			toDelete = await newSubject({ query: { name: "to delete" } })
		})

		it("Delete subject by Name", async () => {
			await deleteSubject({
				query: {
					name: toDelete.name,
				}
			})

			assert(await Section.exists({ name: toDelete.name }).then(res => res === null))
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
