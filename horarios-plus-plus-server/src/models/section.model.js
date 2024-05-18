import mongoose from "mongoose"

const SectionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nrc: { type: String, require: true, unique: true },
  teacher: { type: String, require: true, unique: false },
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" }
})

const Section = mongoose.model(SectionSchema, "Section") 
export default Section
