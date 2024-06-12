import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: false },
  id: { type: String, require: true, unique: true },
  type: { type: String, require: true, unique: false },
	schedule: { type: mongoose.Schema.Types.ObjectId, require: false, unique: false, ref: "Schedule" }
})

const User = mongoose.model("User", UserSchema)
export default User
