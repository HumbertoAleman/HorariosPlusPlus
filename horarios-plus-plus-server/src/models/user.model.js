import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: false }
})

const User = mongoose.model(UserSchema, "User")
export default User
