import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OTPSchema: Schema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Auto delete after the expiresAt date is reached
    },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const OTPModel = mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);
export default OTPModel as mongoose.Model<IOTP>;
