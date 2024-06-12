import assert from "assert"
import Subject from "../src/models/subject.model.js"
import SubjectController from "../src/routes/subject/SubjectController.js"
import Section from "../src/models/section.model.js"
import SectionController from "../src/routes/section/SectionController.js"

describe("Section CRUD", () => {
	let subject
	beforeEach(async () => {
		subject = await SubjectController.newSubject()
	})

	// NOTE: CREATE SUBJECTS 
	describe("Create Sections", () => {
		it("Create a new section with no arguments", async () => {
			const section = await SectionController.newSection({ query: { subjectName: subject.name } })
			assert(await Section.checkIfExists(section.nrc) && await Subject.hasSection(subject._id, section._id))
		})
	})

	// NOTE: READ SUBJECTS 
	describe("Get Sections", () => {
		let toRead
		beforeEach(async () => {
			toRead = await SectionController.newSection({ query: { subjectName: subject.name } })
		})

		it("Read a section (ID)", async () => {
			assert(await SectionController.getSection({ query: { id: toRead._id } }).then(res => res._id.equals(toRead._id)))
		})

		it("Read a section (NRC)", async () => {
			assert(await SectionController.getSection({ query: { nrc: toRead.nrc } }).then(res => res._id.equals(toRead._id)))
		})
	})

	// NOTE: UPDATE SUBJECTS 
	describe("Update a Section", () => {
		let toUpdate
		beforeEach(async () => {
			toUpdate = await SectionController.newSection({ query: { subjectName: subject.name } })
		})

		it("Update a section", async () => {
			assert(await SectionController.updateSection({ query: { oldNrc: toUpdate.nrc, newNrc: 32, newTeacher: "Juan" } }).then(res => res._id.equals(toUpdate._id) && res.nrc === 32 && res.teacher === "Juan"))
		})
	})

	// NOTE: DELETE SUBJECTS 
	describe("Delete a Section", () => {
		let toDelete
		beforeEach(async () => {
			toDelete = await SectionController.newSection({ query: { subjectName: subject.name } })
		})

		it("Delete a section", async () => {
			assert(await SectionController.deleteSection({ query: { nrc: toDelete.nrc } }).then(res => Section.checkIfExists(res.nrc).then(res => !res)))
		})
	})
})
