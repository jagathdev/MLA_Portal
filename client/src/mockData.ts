import { Complaint, ComplaintStatus, ComplaintPriority, Initiative, Testimonial, UserProfile } from "./types";

export const MOCK_CITIZEN: UserProfile = {
  id: "USR-001",
  fullName: "Rajesh Kumar",
  mobileNumber: "+91 98765 43210",
  email: "rajesh@email.com",
  cityTown: "Sholinghur",
  villageArea: "Periyapet",
  wardNumber: "Ward 04",
  constituency: "Sholinghur",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
};

export const MOCK_ADMIN = {
  fullName: "Dr. Kapil, MLA",
  email: "mla.sholinghur@tn.gov.in",
  role: "MLA Sholinghur",
  avatarUrl: "/src/assets/images/dr_kapil_portrait_1782530855224.jpg" // Using generated portrait
};

export const MOCK_INITIATIVES: Initiative[] = [
  {
    id: "init-1",
    title: "Sholinghur Model Schools Upgrade",
    category: "Education",
    description: "Upgrading 15 government schools with state-of-the-art smart classrooms, computer labs, and modern sanitization facilities.",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
    progress: 85
  },
  {
    id: "init-2",
    title: "Drilling & Pipelines for Water Scarcity Areas",
    category: "Water Supply",
    description: "Installing deep borewells and laying over 24km of new pipeline network to supply drinking water to remote villages in Sholinghur.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format&fit=crop&q=60",
    progress: 60
  },
  {
    id: "init-3",
    title: "Primary Healthcare Centers Revamp",
    category: "Healthcare",
    description: "Providing modern diagnostic equipment, 24/7 power backup, and regular specialist camps across 6 major PHCs in the constituency.",
    imageUrl: "https://images.unsplash.com/photo-1517120026326-d87759a7b63b?w=600&auto=format&fit=crop&q=60",
    progress: 75
  },
  {
    id: "init-4",
    title: "Dr. Kapil MLA Sports Ground Initiative",
    category: "Infrastructure",
    description: "Developing safe, multi-sport mini-stadiums with modern running tracks and open-gym equipment in larger village wards.",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=60",
    progress: 45
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "S. Murugan",
    village: "Kondapuram Village",
    rating: 5,
    category: "Roads & Infrastructure",
    quote: "The pothole on our main access road was causing severe accidents. Filed a complaint and the team completely re-tarred the street in just 3 days! Outstanding service.",
    daysTaken: 3
  },
  {
    id: "t-2",
    name: "Lakshmi Priya",
    village: "Sholinghur Town",
    rating: 5,
    category: "Water Supply",
    quote: "Our ward was struggling with highly irregular borewell supply. Within 48 hours of filing the complaint, municipal operators came and cleared the block. Incredible response!",
    daysTaken: 2
  },
  {
    id: "t-3",
    name: "Arun Pandian",
    village: "Banavaram Ward 11",
    rating: 5,
    category: "Electricity",
    quote: "Streetlights were completely dark for months. The MLA portal team approved the complaint immediately and municipal linesmen replaced the bulbs. Very safe now for children.",
    daysTaken: 1
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [];

export function initializeDatabase() {
  // Temporary migration: clean up dummy data from existing local storage
  const existing = localStorage.getItem("namma_ooru_complaints");
  if (existing) {
    const parsed = JSON.parse(existing);
    const dummyIds = ["NM-2025-0891", "NM-2025-0743", "NM-2025-0612", "NM-2025-0541", "NM-2025-0389"];
    const filtered = parsed.filter((c: any) => !dummyIds.includes(c.id));
    if (filtered.length !== parsed.length) {
      localStorage.setItem("namma_ooru_complaints", JSON.stringify(filtered));
    }
  }

  if (!localStorage.getItem("namma_ooru_complaints")) {
    localStorage.setItem("namma_ooru_complaints", JSON.stringify(INITIAL_COMPLAINTS));
  }
  if (!localStorage.getItem("namma_ooru_citizen_profile")) {
    localStorage.setItem("namma_ooru_citizen_profile", JSON.stringify(MOCK_CITIZEN));
  }
  if (!localStorage.getItem("namma_ooru_current_user_role")) {
    // default: null (not logged in), can be 'citizen' or 'admin'
    localStorage.setItem("namma_ooru_current_user_role", JSON.stringify(null));
  }
}

export function getComplaints(): Complaint[] {
  initializeDatabase();
  return JSON.parse(localStorage.getItem("namma_ooru_complaints") || "[]");
}

export function saveComplaints(complaints: Complaint[]) {
  localStorage.setItem("namma_ooru_complaints", JSON.stringify(complaints));
}

export function getCitizenProfile(): UserProfile {
  initializeDatabase();
  return JSON.parse(localStorage.getItem("namma_ooru_citizen_profile") || "{}");
}

export function saveCitizenProfile(profile: UserProfile) {
  localStorage.setItem("namma_ooru_citizen_profile", JSON.stringify(profile));
}

export function getCurrentUserRole(): "citizen" | "admin" | null {
  initializeDatabase();
  return JSON.parse(localStorage.getItem("namma_ooru_current_user_role") || "null");
}

export function setCurrentUserRole(role: "citizen" | "admin" | null) {
  localStorage.setItem("namma_ooru_current_user_role", JSON.stringify(role));
}

export const MOCK_CITIZEN_PROFILE = MOCK_CITIZEN;

export function initializeLocalStorage() {
  initializeDatabase();
}

export function getCitizenComplaints(mobile: string): Complaint[] {
  return getComplaints().filter(c => c.mobileNumber === mobile || c.email === mobile);
}

export function getAllComplaints(): Complaint[] {
  return getComplaints();
}

export function saveComplaint(data: {
  citizenMobile: string;
  citizenName: string;
  category: string;
  subject: string;
  description: string;
  villageArea: string;
  wardNumber: string;
  priority: string;
  imageEvidence?: string[];
}): Complaint {
  const list = getComplaints();
  const nextId = `NM-2025-${Math.floor(1000 + Math.random() * 9000)}`;
  const newComp: Complaint = {
    id: nextId,
    fullName: data.citizenName,
    mobileNumber: data.citizenMobile,
    email: "",
    category: data.category,
    subject: data.subject,
    description: data.description,
    villageArea: data.villageArea,
    wardNumber: data.wardNumber,
    priority: data.priority as any,
    status: ComplaintStatus.SUBMITTED,
    dateSubmitted: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
    lastUpdated: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
    adminRemarks: "",
    timeline: [
      {
        id: `tl-${Math.random()}`,
        status: ComplaintStatus.SUBMITTED,
        date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        time: "10:00 AM",
        remark: "Grievance registered securely."
      }
    ],
    imageEvidence: data.imageEvidence || []
  };
  list.unshift(newComp);
  saveComplaints(list);
  return newComp;
}

export function updateComplaintStatus(
  id: string, 
  newStatus: "Pending" | "Reviewed" | "Resolved" | "In Progress" | "Dismissed", 
  payload?: any
) {
  const list = getComplaints();
  const found = list.find((c) => c.id === id);
  if (found) {
    let mappedStatus = ComplaintStatus.SUBMITTED;
    if (newStatus === "Reviewed") mappedStatus = ComplaintStatus.UNDER_REVIEW;
    if (newStatus === "Resolved") mappedStatus = ComplaintStatus.RESOLVED;
    if (newStatus === "In Progress") mappedStatus = ComplaintStatus.IN_PROGRESS;
    if (newStatus === "Dismissed") mappedStatus = ComplaintStatus.CLOSED;

    found.status = mappedStatus;
    found.lastUpdated = new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    
    if (newStatus === "Resolved" && payload) {
      found.resolutionDetails = payload;
    }
    
    if (newStatus === "In Progress" && payload?.estimatedResolutionDate) {
      found.estimatedResolutionDate = payload.estimatedResolutionDate;
    }

    if (newStatus === "Dismissed" && payload?.dismissalReason) {
      found.dismissalReason = payload.dismissalReason;
    }

    found.timeline.push({
      id: `tl-${Math.random()}`,
      status: mappedStatus,
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" }),
      remark: `Status updated to ${newStatus}`
    });
    saveComplaints(list);
  }
}
