import mongoose from "mongoose"
import Section from "../../models/section.model.js"
import Subject from "../../models/subject.model.js"
import deleteSection from "../section/section.delete_section.js"

export default async function deleteSubject(req, res) {
  const subjectName = req?.query?.name

  if (subjectName !== undefined) {
    if (await Subject.exists({ name: subjectName }) === null) {
      console.error("ERROR : Subject does not exist, could not delete subject")
      res?.send({ code: 0 })
      return 0
    }
  }

  let deletedData = await Subject.findOneAndDelete({ name: subjectName })
  if (deletedData === undefined) {
    console.error("ERROR : An unexpected deletion error has occured")
    res?.send({ code: 0 })
    return 0
  }

  deletedData.sections.forEach(async sectionId => {
    await Section.findByIdAndDelete(sectionId)
  })

  res?.send(deletedData)
  return deletedData
}