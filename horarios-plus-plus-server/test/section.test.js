import newSection from "../src/routes/section/section.new_section.js"
import newSubject from "../src/routes/subject/subject.new_subject.js"
import deleteSection from "../src/routes/section/section.delete_section.js"

import Section from "../src/models/section.model.js"
import assert from "assert"

import mongoose from "mongoose"
import Subject from "../src/models/subject.model.js"

describe("Section CRUD", () => {
	let subject
	beforeEach(async () => {
		subject = await newSubject({ query: { name: "Subject" } });
	})

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

