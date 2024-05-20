import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  start: {
    minute: { type: Number, required: true },
    hour: { type: Number, required: true },
  },
  end: {
    minute: { type: Number, required: true },
    hour: { type: Number, required: true },
  },
  day: { type: Number, required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" }
})

const Session = mongoose.model("Session", sessionSchema)
export default Session