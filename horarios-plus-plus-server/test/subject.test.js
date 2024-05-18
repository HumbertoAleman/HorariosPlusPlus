import Subject from "../src/models/subject.model.js"
import newSubject from "../src/routes/subject/subject.new_subject.js"
import assert from "assert"

describe("Subject CRUD", () => {
  it("Create a new subject with no arguments", async () => {
    let res = await newSubject()
    assert(Subject.find(res))
  })

  it("Create new subject with name", async () => {
    let res = await newSubject({ query: { name: "hello world!"} })
    assert(Subject.find(res))
  })

  it("Create new subject with sections in", async () => {
    let res = await newSubject({ query: { nrcs: [] } })
    assert(Subject.find(res))
  })
})
