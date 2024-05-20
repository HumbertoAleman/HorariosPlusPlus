import mongoose from "mongoose"
import Section from "../../models/section.model.js"
import Subject from "../../models/subject.model.js"

export default async function deleteSection(req, res) {
  const sectionNrc = req?.query?.nrc

  if (sectionNrc !== undefined) {
    if (await Section.exists({ nrc: sectionNrc }) === null) {
      console.error("ERROR : Section does not exist, could not delete section")
      res?.send({ code: 0 })
      return 0
    }
  }

  const deletedData = await Section.findOneAndDelete({ nrc: sectionNrc })
  if (deletedData === undefined || deletedData === null) {
    console.error("ERROR : An unexpected deletion error has occured")
    res?.send({ code: 0 })
    return 0
  }

  const subjectToUpdate = await Subject.findById(deletedData.subject)
  const updatedSubject = await Subject.findOneAndUpdate(subjectToUpdate,
    { sections: subjectToUpdate.sections.filter(id => !id.equals(deletedData._id)) })

  res?.send(deletedData)
  return deletedData
}