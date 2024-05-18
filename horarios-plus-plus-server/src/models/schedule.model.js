import mongoose from "mongoose"

const ScheduleSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  owner: { type: mongoose.Schema.Types.ObjectId, require: true, unique: true },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
})

const Schedule = mongoose.model(ScheduleSchema, "Schedule")
export default Schedule