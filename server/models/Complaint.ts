import mongoose, { Schema, Document } from "mongoose";

export interface ITimelineEntry {
  id: string;
  status: string;
  date: string;
  time: string;
  remark: string;
}

export interface IComplaint extends Document {
  complaintId: string;
  userId?: mongoose.Types.ObjectId;
  fullName: string;
  mobileNumber: string;
  email: string;
  category: string;
  subject: string;
  description: string;
  villageArea: string;
  wardNumber: string;
  priority: string;
  status: string;
  dateSubmitted: string;
  lastUpdated: string;
  adminRemarks: string;
  timeline: ITimelineEntry[];
  imageEvidence?: string[];
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineEntrySchema = new Schema({
  id: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  remark: { type: String, required: true }
});

const ComplaintSchema: Schema = new Schema(
  {
    complaintId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    fullName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: { type: String, default: "" },
    category: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    villageArea: { type: String, required: true },
    wardNumber: { type: String, default: "" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Approved", "In Progress", "Resolved", "Closed", "Rejected"],
      default: "Submitted"
    },
    dateSubmitted: { type: String, required: true },
    lastUpdated: { type: String, required: true },
    adminRemarks: { type: String, default: "" },
    timeline: [TimelineEntrySchema],
    imageEvidence: { type: [String], default: [] },
    resolvedAt: { type: Date },
    closedAt: { type: Date }
  },
  {
    timestamps: true,
  }
);

const ComplaintModel = mongoose.models.Complaint || mongoose.model<IComplaint>("Complaint", ComplaintSchema);
export default ComplaintModel as mongoose.Model<IComplaint>;
