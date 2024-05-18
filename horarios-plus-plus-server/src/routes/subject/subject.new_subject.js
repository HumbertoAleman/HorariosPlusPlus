import mongoose from "mongoose"

export default async function newSubject(req, res) {
  const subjectName = req?.query?.name
  const subjectSections = req?.query?.nrcs
  const subjectCareers = req?.query?.careerNames

  const subjectCount = await Subject.find().countDocuments() ?? 0
  const newSubject = new Subject({
    _id: new mongoose.mongo.ObjectId,
    name: (subjectName || null) ?? ("New Subject " + subjectCount),
    sections: subjectSections?.split(',') ?? [],
    careers: subjectCareers?.split(',') ?? [],
  })
  newSubject.save()

  res?.send(newSubject)
  return newSubject
}