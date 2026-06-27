export enum ComplaintStatus {
  SUBMITTED = "Submitted",
  UNDER_REVIEW = "Under Review",
  APPROVED = "Approved",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
  CLOSED = "Closed",
  REJECTED = "Rejected"
}

export enum ComplaintPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High"
}

export interface TimelineEntry {
  id: string;
  status: ComplaintStatus;
  date: string;
  time: string;
  remark: string;
}

export interface ResolutionDetails {
  actionTaken: string;
  assignedOfficer: string;
  completionDate: string;
  remarks: string;
}

export interface Complaint {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  category: string;
  subject: string;
  description: string;
  villageArea: string;
  wardNumber: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  dateSubmitted: string;
  lastUpdated: string;
  adminRemarks: string;
  timeline: TimelineEntry[];
  imageEvidence?: string[];
  resolutionDetails?: ResolutionDetails;
  estimatedResolutionDate?: string;
  dismissalReason?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  cityTown: string;
  villageArea: string;
  wardNumber: string;
  constituency: string;
  avatarUrl?: string;
}

export interface Initiative {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  progress: number;
}

export interface Testimonial {
  id: string;
  name: string;
  village: string;
  rating: number;
  category: string;
  quote: string;
  daysTaken: number;
}
