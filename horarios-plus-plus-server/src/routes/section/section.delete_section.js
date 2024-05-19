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

  let deletedData = await Section.findOneAndDelete({ nrc: sectionNrc })
  if (deletedData === undefined) {
    console.error("ERROR : An unexpected deletion error has occured")
    res?.send({ code: 0 })
    return 0
  }

  res?.send(deletedData)
  return deletedData
}