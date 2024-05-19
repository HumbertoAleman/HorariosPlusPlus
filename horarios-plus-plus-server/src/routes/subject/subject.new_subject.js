import mongoose from "mongoose"
import Subject from "../../models/subject.model.js"

export default async function newSubject(req, res) {
  const subjectName = req?.query?.name
  const subjectCareers = req?.query?.careerNames

  if (subjectName !== undefined) {
    if (await Subject.exists({ name: subjectName }) !== null) {
      console.error("ERROR: Cannot add two subjects with the same name")
      res?.send({ code: 0 })
      return 0
    }
  }

  const subjectCount = await Subject.find().countDocuments() ?? 0
  const newSubject = new Subject({
    _id: new mongoose.mongo.ObjectId,
    name: (subjectName || null) ?? ("New Subject " + subjectCount),
    sections: [],
    careers: subjectCareers?.split(',') ?? [],
  })

  const savedSubject = await newSubject.save()
  if (savedSubject !== newSubject) {
    console.error("ERROR : Unknown error when saving section")
    res?.send({ code: 0 })
    return 0
  }

  res?.send(newSubject)
  return newSubject
}