import mongoose from "mongoose"

const SubjectSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, require: true, unique: true },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
  careers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Career" }],
})

const Subject = mongoose.model("Subject", SubjectSchema) 
export default Subject