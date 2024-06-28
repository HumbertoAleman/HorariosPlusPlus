import mongoose from "mongoose"

const CareerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, require: true, unique: true },
  Subject: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]
})

const Career = mongoose.model("Career", CareerSchema)
export default Career