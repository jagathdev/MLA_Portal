import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, ListTodo, FileEdit, UserSquare2, LogOut, CheckCircle2,
  Hourglass, CheckSquare, Search, PlusCircle, ArrowRight, Save, User, MapPin, BadgeCheck,
  Globe
} from "lucide-react";
import { Complaint } from "../../types";
import { getCitizenComplaints, saveComplaint, MOCK_CITIZEN_PROFILE } from "../../mockData";
import "./CitizenDashboard.css";

interface CitizenDashboardProps {
  currentLang: "en" | "ta";
  citizenName: string;
  citizenMobile: string;
  onLogout: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onGoHome?: () => void;
  newComplaintDraft?: any;
}

export default function CitizenDashboard({
  currentLang,
  citizenName,
  citizenMobile,
  onLogout,
  onSelectComplaint,
  onGoHome
}: CitizenDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "grievances" | "submit" | "account">("overview");
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // Filters for grievances
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Profile loader helper
  const getInitialProfile = () => {
    try {
      const saved = localStorage.getItem("namma_ooru_citizen_profile");
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return { email: "", village: "", ward: "" };
  };

  const initialProfile = getInitialProfile();

  // Account settings state
  const isEmailInsteadOfMobile = citizenMobile.includes("@");
  const [accName, setAccName] = useState(citizenName);
  const [accMobile, setAccMobile] = useState(isEmailInsteadOfMobile ? "" : citizenMobile);
  const [accEmail, setAccEmail] = useState(() => {
    if (isEmailInsteadOfMobile) return citizenMobile;
    if (initialProfile.email === "rajesh@email.com") return "";
    return initialProfile.email || "";
  });
  const [accVillage, setAccVillage] = useState(initialProfile.village || "");
  const [accWard, setAccWard] = useState(initialProfile.ward || "");
  const [accountSaved, setAccountSaved] = useState(false);

  // File new complaint state
  const [newSubject, setNewSubject] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("🛣️ Roads & Infrastructure");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newVillage, setNewVillage] = useState(initialProfile.village || "");
  const [newWard, setNewWard] = useState(initialProfile.ward || "");
  const [fileSuccess, setFileSuccess] = useState(false);

  const t = {
    en: {
      overview: "My Overview",
      grievances: "My Grievances",
      submit: "File Grievance",
      account: "My Account",
      logout: "Sign Out",
      welcome: "Welcome Back",
      role: "Verified Citizen",
      total: "Total Submitted",
      pending: "Under Review",
      resolved: "Resolved Cases",
      noGrievances: "No grievances registered yet.",
      submitCTA: "File a New Complaint",
      searchPlaceholder: "Search complaints by ID, title...",
      statusAll: "All Statuses",
      catAll: "All Categories",
      idCol: "ID",
      subjCol: "Subject",
      catCol: "Category",
      statusCol: "Status",
      priorityCol: "Priority",
      dateCol: "Date Added",
      actionCol: "Timeline",
      viewBtn: "View",
      accTitle: "Profile Settings",
      accSub: "Update your personal and ward information for faster address verification.",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      phoneLabel: "Phone Number",
      villageLabel: "Village / Town Ward",
      wardLabel: "Ward Number",
      saveProfile: "Save Changes",
      profileSuccess: "Profile updated successfully!",
      newTitle: "Submit New Grievance",
      newSub: "Please fill out all fields. Relevant images will speed up resolution.",
      subjLabel: "Subject Title",
      descLabel: "Detailed Description",
      catLabel: "Category Type",
      priorityLabel: "Priority Level",
      submitGrievance: "Submit Complaint",
      fileSuccessMsg: "Complaint registered successfully! It is now being reviewed by Dr. Kapil's team."
    },
    ta: {
      overview: "கண்ணோட்டம்",
      grievances: "என் புகார்கள்",
      submit: "புகார் செய்க",
      account: "என் கணக்கு",
      logout: "வெளியேறு",
      welcome: "நல்வரவு",
      role: "சரிபார்க்கப்பட்ட குடிமகன்",
      total: "மொத்த புகார்கள்",
      pending: "மதிப்பாய்வில்",
      resolved: "தீர்க்கப்பட்டவை",
      noGrievances: "இன்னும் புகார்கள் எதுவும் பதிவு செய்யப்படவில்லை.",
      submitCTA: "புதிய புகார் பதிவு செய்க",
      searchPlaceholder: "புகார் எண், தலைப்பு மூலம் தேடவும்...",
      statusAll: "அனைத்து நிலை",
      catAll: "அனைத்து வகைகள்",
      idCol: "புகார் எண்",
      subjCol: "தலைப்பு",
      catCol: "வகை",
      statusCol: "நிலை",
      priorityCol: "முன்னுரிமை",
      dateCol: "தேதி",
      actionCol: "காலவரிசை",
      viewBtn: "காண்",
      accTitle: "தனிநபர் சுயவிவரம்",
      accSub: "முகவரியை விரைவாகச் சரிபார்க்க உங்கள் வார்டு விவரங்களைப் புதுப்பிக்கவும்.",
      nameLabel: "முழு பெயர்",
      emailLabel: "மின்னஞ்சல் முகவரி",
      phoneLabel: "தொலைபேசி எண்",
      villageLabel: "கிராமம் / வார்டு",
      wardLabel: "வார்டு எண்",
      saveProfile: "மாற்றங்களைச் சேமிக்கவும்",
      profileSuccess: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
      newTitle: "புதிய புகார் பதிவு",
      newSub: "அனைத்து விவரங்களையும் பூர்த்தி செய்யவும். புகைப்படங்கள் தீர்வை விரைவுபடுத்தும்.",
      subjLabel: "புகாரின் தலைப்பு",
      descLabel: "விரிவான விளக்கம்",
      catLabel: "புகாரின் வகை",
      priorityLabel: "முன்னுரிமை நிலை",
      submitGrievance: "புகாரைச் சமர்ப்பிக்கவும்",
      fileSuccessMsg: "புகார் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது! அது எம்.எல்.ஏ அலுவலகக் குழுவால் சரிபார்க்கப்படுகிறது."
    }
  }[currentLang];

  // Fetch complaints on load
  useEffect(() => {
    const list = getCitizenComplaints(citizenMobile);
    setComplaints(list);

    // Auto-prefill if there is a draft complaint from public landing
    const draft = localStorage.getItem("namma_ooru_complaint_draft");
    if (draft) {
      const parsed = JSON.parse(draft);
      setNewSubject(parsed.subject || "");
      setNewDesc(parsed.description || "");
      setNewCat(parsed.category || "Roads & Infrastructure");
      setNewPriority(parsed.priority || "Medium");
      setNewVillage(parsed.villageArea || initialProfile.village || "");
      setNewWard(parsed.wardNumber || initialProfile.ward || "");

      // Auto route user to "submit" page
      setActiveTab("submit");
      // Remove draft after reading to prevent looping
      localStorage.removeItem("namma_ooru_complaint_draft");
    }
  }, [citizenMobile]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = {
      name: accName,
      mobile: accMobile,
      email: accEmail,
      village: accVillage,
      ward: accWard
    };
    localStorage.setItem("namma_ooru_citizen_profile", JSON.stringify(updatedProfile));
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 4000);
  };

  const handleNewComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newDesc || !newVillage) return;

    const saved = saveComplaint({
      citizenMobile,
      citizenName: accName,
      category: newCat,
      subject: newSubject,
      description: newDesc,
      villageArea: newVillage,
      wardNumber: newWard,
      priority: newPriority
    });

    setComplaints((prev) => [saved, ...prev]);
    setNewSubject("");
    setNewDesc("");
    setFileSuccess(true);
    setTimeout(() => {
      setFileSuccess(false);
      setActiveTab("grievances");
    }, 3000);
  };

  // Compute counts
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status !== "Resolved").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="dashboard-container">
      {/* Sidebar navigation */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__top">
          <div className="dashboard-sidebar__profile">
            <div className="dashboard-sidebar__avatar">
              {citizenName.substring(0, 1)}
            </div>
            <div>
              <div className="dashboard-sidebar__name">{citizenName}</div>
              <div className="dashboard-sidebar__role">{t.role}</div>
            </div>
          </div>

          <nav className="dashboard-sidebar__menu">
            {onGoHome && (
              <button
                className="dashboard-sidebar__btn"
                onClick={onGoHome}
              >
                <Globe size={18} />
                <span>{currentLang === "en" ? "Back to Home" : "முகப்பிற்கு செல்"}</span>
              </button>
            )}

            <button
              className={`dashboard-sidebar__btn ${activeTab === "overview" ? "dashboard-sidebar__btn--active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <LayoutDashboard size={18} />
              <span>{t.overview}</span>
            </button>

            <button
              className={`dashboard-sidebar__btn ${activeTab === "grievances" ? "dashboard-sidebar__btn--active" : ""}`}
              onClick={() => setActiveTab("grievances")}
            >
              <ListTodo size={18} />
              <span>{t.grievances}</span>
            </button>

            <button
              className={`dashboard-sidebar__btn ${activeTab === "submit" ? "dashboard-sidebar__btn--active" : ""}`}
              onClick={() => setActiveTab("submit")}
            >
              <FileEdit size={18} />
              <span>{t.submit}</span>
            </button>

            <button
              className={`dashboard-sidebar__btn ${activeTab === "account" ? "dashboard-sidebar__btn--active" : ""}`}
              onClick={() => setActiveTab("account")}
            >
              <UserSquare2 size={18} />
              <span>{t.account}</span>
            </button>
          </nav>
        </div>

        <div className="dashboard-sidebar__footer">
          <button className="dashboard-sidebar__btn" onClick={onLogout} style={{ color: "var(--color-danger)" }}>
            <LogOut size={18} />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Panel space */}
      <main className="dashboard-main">
        <div className="dashboard-main__header">
          <div>
            <h1 className="dashboard-main__welcome">{t.welcome}, {citizenName}</h1>
            <p className="dashboard-main__date">
              {new Date().toLocaleDateString(currentLang === "en" ? "en-US" : "ta-IN", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          </div>
          {activeTab !== "submit" && (
            <button className="btn btn--primary" onClick={() => setActiveTab("submit")}>
              <PlusCircle size={16} />
              <span>{t.submitCTA}</span>
            </button>
          )}
        </div>

        {/* 1. Overview Tab content */}
        {activeTab === "overview" && (
          <div>
            {/* KPI count grid */}
            <div className="dashboard-kpi__grid">
              <div
                className="dashboard-kpi__card"
                style={{ cursor: "pointer" }}
                onClick={() => { setStatusFilter("All"); setActiveTab("grievances"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                <div className="dashboard-kpi__icon" style={{ background: "rgba(255, 107, 0, 0.08)", color: "var(--color-saffron)" }}>
                  <CheckSquare size={24} />
                </div>
                <div>
                  <div className="dashboard-kpi__val">{totalCount}</div>
                  <div className="dashboard-kpi__label">{t.total}</div>
                </div>
              </div>

              <div
                className="dashboard-kpi__card"
                style={{ cursor: "pointer" }}
                onClick={() => { setStatusFilter("Pending"); setActiveTab("grievances"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                <div className="dashboard-kpi__icon" style={{ background: "rgba(245, 158, 11, 0.08)", color: "var(--color-warning)" }}>
                  <Hourglass size={24} />
                </div>
                <div>
                  <div className="dashboard-kpi__val">{pendingCount}</div>
                  <div className="dashboard-kpi__label">{t.pending}</div>
                </div>
              </div>

              <div
                className="dashboard-kpi__card"
                style={{ cursor: "pointer" }}
                onClick={() => { setStatusFilter("Resolved"); setActiveTab("grievances"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                <div className="dashboard-kpi__icon" style={{ background: "rgba(16, 185, 129, 0.08)", color: "var(--color-success)" }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="dashboard-kpi__val">{resolvedCount}</div>
                  <div className="dashboard-kpi__label">{t.resolved}</div>
                </div>
              </div>
            </div>

            {/* List table showing recent */}
            <div className="dashboard-list__card">
              <div className="dashboard-list__header">
                <h3 className="dashboard-list__title">{t.grievances}</h3>
              </div>

              {filteredComplaints.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(10, 22, 40, 0.5)" }}>
                  <ListTodo size={40} style={{ opacity: 0.3, marginBottom: "12px" }} />
                  <p>{t.noGrievances}</p>
                </div>
              ) : (
                <div className="dashboard-table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>{t.idCol}</th>
                        <th>{t.subjCol}</th>
                        <th>{t.catCol}</th>
                        <th>{t.statusCol}</th>
                        <th>{t.priorityCol}</th>
                        <th>{t.dateCol}</th>
                        <th>{t.actionCol}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.slice(0, 5).map((comp) => (
                        <tr key={comp.id}>
                          <td style={{ fontFamily: "var(--font-accent)", fontWeight: 700, color: "var(--color-saffron)" }}>{comp.id}</td>
                          <td className="dashboard-table__complaint-title" onClick={() => onSelectComplaint(comp)}>
                            {comp.subject}
                          </td>
                          <td>{comp.category}</td>
                          <td>
                            <span className={`status-badge status-badge--${comp.status.toLowerCase()}`}>
                              {comp.status}
                            </span>
                          </td>
                          <td>
                            <span className={`priority-badge priority-badge--${comp.priority.toLowerCase()}`}>
                              {comp.priority}
                            </span>
                          </td>
                          <td style={{ fontSize: "0.8rem", color: "rgba(10, 22, 40, 0.5)" }}>{comp.dateSubmitted}</td>
                          <td>
                            <button className="btn btn--outline" style={{ padding: "4px 12px", fontSize: "0.8rem" }} onClick={() => onSelectComplaint(comp)}>
                              <span>{t.viewBtn}</span>
                              <ArrowRight size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Grievances List Tab content */}
        {activeTab === "grievances" && (
          <div className="dashboard-list__card">
            <div className="dashboard-list__header">
              <h3 className="dashboard-list__title">{t.grievances}</h3>
            </div>

            {/* Filter inputs */}
            <div className="dashboard-filter-row">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="dashboard-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="dashboard-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">{t.statusAll}</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                className="dashboard-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">{t.catAll}</option>
                <option value="🛣️ Roads & Infrastructure">🛣️ Roads & Infrastructure</option>
                <option value="💧 Water Supply">💧 Water Supply</option>
                <option value="💡 Electricity">💡 Electricity</option>
                <option value="🗑️ Sanitation">🗑️ Sanitation</option>
                <option value="🏥 Healthcare">🏥 Healthcare</option>
                <option value="📚 Education">📚 Education</option>
                <option value="🚜 Agriculture">🚜 Agriculture</option>
              </select>
            </div>

            {filteredComplaints.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(10, 22, 40, 0.5)" }}>
                <Search size={40} style={{ opacity: 0.3, marginBottom: "12px" }} />
                <p>{currentLang === "en" ? "No complaints match your filters." : "உங்கள் தேடலுக்கு ஏற்ற புகார்கள் எதுவும் இல்லை."}</p>
              </div>
            ) : (
              <div className="dashboard-table-container">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>{t.idCol}</th>
                      <th>{t.subjCol}</th>
                      <th>{t.catCol}</th>
                      <th>{t.statusCol}</th>
                      <th>{t.priorityCol}</th>
                      <th>{t.dateCol}</th>
                      <th>{t.actionCol}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((comp) => (
                      <tr key={comp.id}>
                        <td style={{ fontFamily: "var(--font-accent)", fontWeight: 700, color: "var(--color-saffron)" }}>{comp.id}</td>
                        <td className="dashboard-table__complaint-title" onClick={() => onSelectComplaint(comp)}>
                          {comp.subject}
                        </td>
                        <td>{comp.category}</td>
                        <td>
                          <span className={`status-badge status-badge--${comp.status.toLowerCase()}`}>
                            {comp.status}
                          </span>
                        </td>
                        <td>
                          <span className={`priority-badge priority-badge--${comp.priority.toLowerCase()}`}>
                            {comp.priority}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "rgba(10, 22, 40, 0.5)" }}>{comp.dateSubmitted}</td>
                        <td>
                          <button className="btn btn--outline" style={{ padding: "4px 12px", fontSize: "0.8rem" }} onClick={() => onSelectComplaint(comp)}>
                            <span>{t.viewBtn}</span>
                            <ArrowRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. Submit Tab content */}
        {activeTab === "submit" && (
          <div className="dashboard-list__card" style={{ maxWidth: "800px", padding: "30px", background: "linear-gradient(to bottom, rgba(16, 25, 45, 0.8), rgba(10, 22, 40, 1))", border: "1px solid rgba(255,107,0,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
            <div className="dashboard-list__header" style={{ marginBottom: "25px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" }}>
              <div>
                <h3 className="dashboard-list__title" style={{ fontSize: "1.5rem", color: "var(--color-saffron)" }}>{t.newTitle}</h3>
                <p style={{ fontSize: "0.95rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "8px" }}>{t.newSub}</p>
              </div>
            </div>

            {fileSuccess && (
              <div style={{ display: "flex", gap: "10px", padding: "16px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--color-success)", borderRadius: "var(--border-radius-sm)", marginBottom: "20px", color: "var(--color-success)", alignItems: "center", fontSize: "0.95rem" }}>
                <CheckCircle2 size={20} />
                <span>{t.fileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleNewComplaintSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-primary)", marginBottom: "8px" }}>{t.catLabel}</label>
                  <select
                    className="dashboard-select"
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "12px", borderRadius: "8px" }}
                  >
                    <option value="🛣️ Roads & Infrastructure">🛣️ Roads & Infrastructure</option>
                    <option value="💧 Water Supply">💧 Water Supply</option>
                    <option value="💡 Electricity">💡 Electricity</option>
                    <option value="🗑️ Sanitation">🗑️ Sanitation</option>
                    <option value="🏥 Healthcare">🏥 Healthcare</option>
                    <option value="📚 Education">📚 Education</option>
                    <option value="🚜 Agriculture">🚜 Agriculture</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-primary)", marginBottom: "8px" }}>{t.priorityLabel}</label>
                  <select
                    className="dashboard-select"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "12px", borderRadius: "8px" }}
                  >
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="High">🔴 High</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-primary)", marginBottom: "8px" }}>{t.subjLabel} *</label>
                <input
                  type="text"
                  placeholder="e.g. Broken valve leaks water along Banavaram Main Road"
                  className="dashboard-search-input"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-primary)", marginBottom: "8px" }}>{t.descLabel} *</label>
                <textarea
                  rows={5}
                  placeholder="Describe the problem, precise location coordinates or milestones..."
                  className="dashboard-search-input"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "12px", borderRadius: "8px" }}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-primary)", marginBottom: "8px" }}>{t.villageLabel} *</label>
                  <input
                    type="text"
                    className="dashboard-search-input"
                    placeholder="Enter your village or town area"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "12px", borderRadius: "8px" }}
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-primary)", marginBottom: "8px" }}>{t.wardLabel}</label>
                  <input
                    type="text"
                    className="dashboard-search-input"
                    placeholder="E.g., Ward 4 (Optional)"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "12px", borderRadius: "8px" }}
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn--primary" style={{ width: "100%", padding: "14px" }}>
                <PlusCircle size={18} />
                <span>{t.submitGrievance}</span>
              </button>
            </form>
          </div>
        )}

        {/* 4. Account Settings Tab content */}
        {activeTab === "account" && (
          <div className="dashboard-list__card" style={{ maxWidth: "800px" }}>
            <div className="dashboard-list__header">
              <div>
                <h3 className="dashboard-list__title">{t.accTitle}</h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(10, 22, 40, 0.5)", marginTop: "4px" }}>{t.accSub}</p>
              </div>
            </div>

            {accountSaved && (
              <div style={{ display: "flex", gap: "10px", padding: "16px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--color-success)", borderRadius: "var(--border-radius-sm)", marginBottom: "20px", color: "var(--color-success)", alignItems: "center", fontSize: "0.95rem" }}>
                <BadgeCheck size={20} />
                <span>{t.profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleProfileSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-primary)", marginBottom: "8px" }}>{t.nameLabel}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="dashboard-search-input"
                      value={accName}
                      onChange={(e) => setAccName(e.target.value)}
                      required
                    />
                    <User size={16} style={{ position: "absolute", right: "12px", top: "12px", opacity: 0.4 }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-primary)", marginBottom: "8px" }}>{t.phoneLabel}</label>
                  <input
                    type="text"
                    className="dashboard-search-input"
                    value={accMobile}
                    disabled
                    style={{ background: "rgba(10, 22, 40, 0.04)", opacity: 0.7 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-primary)", marginBottom: "8px" }}>{t.emailLabel}</label>
                <input
                  type="email"
                  className="dashboard-search-input"
                  value={accEmail}
                  onChange={(e) => setAccEmail(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-primary)", marginBottom: "8px" }}>{t.villageLabel}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="dashboard-search-input"
                      value={accVillage}
                      onChange={(e) => setAccVillage(e.target.value)}
                    />
                    <MapPin size={16} style={{ position: "absolute", right: "12px", top: "12px", opacity: 0.4 }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-primary)", marginBottom: "8px" }}>{t.wardLabel}</label>
                  <input
                    type="text"
                    className="dashboard-search-input"
                    placeholder="Enter Ward Number (Optional)"
                    value={accWard}
                    onChange={(e) => setAccWard(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn--primary" style={{ padding: "14px 24px" }}>
                <Save size={18} />
                <span>{t.saveProfile}</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
