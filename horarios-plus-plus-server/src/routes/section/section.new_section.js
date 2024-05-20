import mongoose from "mongoose"
import Section from "../../models/section.model.js"
import Subject from "../../models/subject.model.js"

export default async function newSection(req, res) {
  const sectionNrc = req?.query?.nrc
  const sectionTeacher = req?.query?.teacher
  const sessions = req?.query?.sessionsIds
  const subjectName = req?.query?.subjectName

  if (subjectName === undefined) {
    console.error("ERROR : Subject name cannot be undefined when creating a section")
    res?.send({ code: 0 })
    return 0
  } else if (await Subject.exists({ name: subjectName }).then(res => res === null)) {
    console.error("ERROR : Cannot add section to a subject that doesn't exist")
    res?.send({ code: 0 })
    return 0
  }

  if (sectionNrc !== undefined) {
    if (await Section.exists({ nrc: sectionNrc }).then(res => res !== null)) {
      console.error("ERROR : Cannot add two sections with the same nrc")
      res?.send({ code: 0 })
      return 0
    }
  }

  const sectionCount = await Section.find().countDocuments() ?? 0
  const relatedSubject = await Subject.findOne({ name: subjectName })
  const newSection = new Section({
    _id: new mongoose.mongo.ObjectId,
    nrc: sectionNrc ?? parseInt(sectionCount),
    teacher: sectionTeacher ?? "Por Asignar",
    sessions: sessions?.split(',') ?? [],
    subject: new mongoose.mongo.ObjectId(relatedSubject._id)
  })

  const savedSection = await newSection.save()
  if (savedSection !== newSection) {
    console.error("ERROR : Unknown error when saving section")
    res?.send({ code: 0 })
    return 0
  }

  await Subject.findOneAndUpdate(relatedSubject,
    { sections: relatedSubject.sections.concat(new mongoose.mongo.ObjectId(savedSection._id)) })

  res?.send(savedSection)
  return savedSection
}