import newSection from "../src/routes/section/section.new_section.js"
import newSubject from "../src/routes/subject/subject.new_subject.js"
import deleteSection from "../src/routes/section/section.delete_section.js"
import getSection from "../src/routes/section/section.get_section.js"
import getSections from "../src/routes/section/section.get_sections.js"

import Section from "../src/models/section.model.js"
import assert from "assert"

import mongoose from "mongoose"
import Subject from "../src/models/subject.model.js"
import updateSection from "../src/routes/section/section.update_section.js"

describe("Section CRUD", () => {
	let subject
	beforeEach(async () => {
		subject = await newSubject({ query: { name: "Subject" } });
	})

	// NOTE: CREATE SECTIONS
	describe("Create Sections", () => {
		it("Create a new section with no arguments", async () => {
			await newSection({
				query: { subjectName: subject.name }
			})

			assert(await Section.exists({
				nrc: 0,
				teacher: "Por Asignar",
				sessions: [],
				subject: new mongoose.mongo.ObjectId(subject._id)
			}).then(res => res !== null))
		})

		it("Ensure that section is in subject when created", async () => {
			let createdSection = await newSection({
				query: { subjectName: subject.name }
			})

			assert(await Subject
				.findById({ _id: new mongoose.mongo.ObjectId(subject._id) })
				.then(res =>
					res.sections.some(id => id.equals(new mongoose.mongo.ObjectId(createdSection._id)))
				))
		})

		it("Create a new section with no arguments, with sections already in db", async () => {
			for (let i = 0; i < 3; i++) {
				await newSection({
					query: {
						nrc: i,
						subjectName: subject.name
					}
				})
			}

			assert(await Section.exists({
				nrc: 2,
				teacher: "Por Asignar",
				sessions: [],
				subject: new mongoose.mongo.ObjectId(subject._id)
			}))
		})

		it("Create new section with nrc and teacher", async () => {
			await newSection({
				query: {
					nrc: 21,
					teacher: "Test Teacher",
					subjectName: subject.name
				}
			})

			assert(await Section.exists({
				nrc: 21,
				teacher: "Test Teacher",
				sessions: [],
				subject: new mongoose.mongo.ObjectId(subject._id)
			}))
		})

		it("Throw when adding duplicate NRCs", async () => {
			await newSection({
				query: { nrc: 21, subjectName: subject.name }
			})
			assert(await newSection({
				query: { nrc: 21, subjectName: subject.name }
			}).then(res => res.message === "ERROR Duplicate NRC"))
		})

		it("Throw when subject name is undefined", async () => {
			assert(await newSection({
				query: { nrc: 21 }
			}).then(res => res.message === "ERROR Subject name is undefined"))
		})

		it("Throw when adding to a section that doesn't exist", async () => {
			assert(await newSection({
				query: { nrc: 21, subjectName: "Oogly oo" }
			}).then(res => res.message === "ERROR Subject does not exist"))
		})
	})

	// NOTE: READ SECTIONS
	describe("Read Sections", () => {
		let toRead
		beforeEach(async () => {
			toRead = await newSection({ query: { nrc: "1", subjectName: subject.name } })
		})

		it("Get section using nrc", async () => {
			assert(await getSection({ query: { nrc: toRead.nrc } })
				.then(res => res.nrc === toRead.nrc))
		})

		it("Throw when nrc is undefined", async () => {
			assert(await getSection({ query: { nrc: undefined } })
				.then(res => res.message === "ERROR sectionNRC is undefined"))
		})

		it("Throw when nrc is not found", async () => {
			assert(await getSection({ query: { nrc: "32" } })
				.then(res => res.message === "ERROR section with nrc 32 was not found"))
		})

		it("Get sections from a subject", async () => {
			await newSection({ query: { nrc: "2", subjectName: subject.name } })
			await newSection({ query: { nrc: "3", subjectName: subject.name } })
			assert(await getSections({ query: { subjectName: subject.name } })
				.then(res => res.every(section => ["1", "2", "3"].includes(section.nrc))))
		})

		it("Throw when subjectName is undefined", async () => {
			assert(await getSections({ query: { subjectName: undefined } })
				.then(res => res.message === "ERROR subjectName is undefined"))
		})

		it("Throw when subject is not found", async () => {
			assert(await getSections({ query: { subjectName: "MATERIA DOS" } })
				.then(res => res.message === "ERROR subject does not exist"))
		})
	})

	// NOTE: UPDATE SECTIONS
	describe("Update Sections", () => {
		let toUpdate
		beforeEach(async () => {
			toUpdate = await newSection({ query: { nrc: "0", subjectName: subject.name } })
		})

		it("Update section nrc", async () => {
			assert(await updateSection({ query: { oldNrc: "0", newNrc: "1" } })
				.then(res => res._id.equals(toUpdate._id) && res.nrc === "1"))
		})

		it("Update section teacher", async () => {
			assert(await updateSection({ query: { oldNrc: "0", newTeacher: "Gustav" } })
				.then(res => res._id.equals(toUpdate._id) && res.teacher === "Gustav"))
		})

		it("Throw when newSection and newTeacher are both undefined", async () => {
			assert(await updateSection({ query: { oldNrc: "0" } })
				.then(res => res.message === "ERROR newNrc and newTeacher are both undefined"))
		})

		it("Throw if oldNrc is undefined", async () => {
			assert(await updateSection({ query: { oldNrc: undefined, newNrc: "1" } })
				.then(res => res.message === "ERROR oldNrc is undefined"))
		})

		it("Throw if no section is found", async () => {
			assert(await updateSection({ query: { oldNrc: "32", newNrc: "1" } })
				.then(res => res.message === "ERROR section with nrc 32 was not found"))
		})
	})

	// NOTE: DELETE SECTIONS
	describe("Delete Sections", () => {
		let toDelete
		beforeEach(async () => {
			toDelete = await newSection({ query: { nrc: 0, subjectName: subject.name } })
		})

		it("Delete section by NRC", async () => {
			assert(await deleteSection({
				query: {
					nrc: 0,
				}
			}).then(res => res._id.equals(toDelete._id)))
		})

		it("Delete section and ensure that its removed from subject", async () => {
			await deleteSection({ query: { nrc: 0, } })
			assert(await Subject.findById(subject._id)
				.then(res => !res.sections.some(id => id.equals(toDelete._id))))
		})

		it("Throw when deleting section that doesnt exist", async () => {
			assert(await deleteSection({
				query: { nrc: 1, }
			}).then(res => res.message === "ERROR Section does not exist"))
		})
	})
})

