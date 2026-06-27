import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password?: string;
  city?: string;
  village?: string;
  ward?: string;
  role: "citizen" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String },
    village: { type: String },
    ward: { type: String },
    role: { type: String, enum: ["citizen", "admin"], default: "citizen" },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default UserModel as mongoose.Model<IUser>;
