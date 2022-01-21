const { Schema, model } = require("mongoose")

const ProfileImgSchema = new Schema({ data: Buffer, contentType: String })

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  profileImg: ProfileImgSchema,
  registerDate: { type: Date, default: Date.now }
})

module.exports = model("User", UserSchema)
