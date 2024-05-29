import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
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
})

const Event = mongoose.model("Event", eventSchema)
export default Event
