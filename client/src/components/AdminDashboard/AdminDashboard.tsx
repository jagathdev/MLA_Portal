import { useState, useEffect, React } from "react";
import {
  Shield, CheckCircle2, AlertTriangle, ListFilter, Search, LogOut, ChevronDown, ChevronUp,
  User, Smartphone, MapPin, Calendar, FileText, CheckCircle, RefreshCw
} from "lucide-react";
import { Complaint } from "../../types";
import { getAllComplaints, updateComplaintStatus } from "../../mockData";
import "./AdminDashboard.css";

interface AdminDashboardProps {
  currentLang: "en" | "ta";
  adminName: string;
  onLogout: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export default function AdminDashboard({
  currentLang,
  adminName,
  onLogout,
  onSelectComplaint
}: AdminDashboardProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter terms
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [resolvingComplaintId, setResolvingComplaintId] = useState<string | null>(null);
  const [resolutionForm, setResolutionForm] = useState({
    actionTaken: "",
    assignedOfficer: "",
    completionDate: new Date().toISOString().split("T")[0],
    remarks: ""
  });

  const [inProgressComplaintId, setInProgressComplaintId] = useState<string | null>(null);
  const [estimatedResolutionDate, setEstimatedResolutionDate] = useState(new Date().toISOString().split("T")[0]);

  const [dismissalComplaintId, setDismissalComplaintId] = useState<string | null>(null);
  const [dismissalReason, setDismissalReason] = useState("");

  const t = {
    en: {
      adminCenter: "MLA Operations Command Center",
      badge: "Administrator Panel",
      welcome: "Welcome, Officer",
      logout: "Exit Panel",
      kpiTotal: "Direct Complaints",
      kpiPending: "Awaiting Action",
      kpiReviewed: "Audited & Assigned",
      kpiResolved: "Cases Settled",
      tableTitle: "Unified Complaint Stream",
      searchPlaceholder: "Search by ID, name, subject...",
      statAll: "All Statuses",
      catAll: "All Categories",
      prioAll: "All Priorities",
      idCol: "ID",
      citizenCol: "Citizen",
      catCol: "Category",
      subjCol: "Subject Title",
      statusCol: "Status",
      priorityCol: "Priority",
      actionCol: "Action",
      markReviewed: "Mark Audited & Assigned",
      markResolved: "Mark Resolved",
      emptyState: "No registered complaints match your search query.",
      expandDetails: "Full Ticket Timeline",
      contact: "Citizen Contact Details",
      detailsTitle: "Detailed Case File"
    },
    ta: {
      adminCenter: "எம்.எல்.ஏ அலுவலக கட்டுப்பாட்டு மையம்",
      badge: "நிர்வாகக் குழு தளம்",
      welcome: "வரவேற்கிறோம், அதிகாரி",
      logout: "வெளியேறு",
      kpiTotal: "மொத்தப் புகார்கள்",
      kpiPending: "நடவடிக்கை நிலுவை",
      kpiReviewed: "மதிப்பாய்வு செய்யப்படுபவை",
      kpiResolved: "தீர்க்கப்பட்டவை",
      tableTitle: "குடிமக்களின் ஒருங்கிணைந்த புகாரோட்டம்",
      searchPlaceholder: "புகார் எண், பெயர், தலைப்பு மூலம் தேடுக...",
      statAll: "அனைத்து நிலை",
      catAll: "அனைத்து வகைகளும்",
      prioAll: "அனைத்து முன்னுரிமை",
      idCol: "புகார் எண்",
      citizenCol: "குடிமகன்",
      catCol: "வகை",
      subjCol: "புகாரின் தலைப்பு",
      statusCol: "நிலை",
      priorityCol: "முன்னுரிமை",
      actionCol: "நடவடிக்கை",
      markReviewed: "சரிபார்க்கப்பட்டது",
      markResolved: "சிக்கல் தீர்க்கப்பட்டது",
      emptyState: "தேடல் வடிகட்டல்களுக்குப் புகார்கள் எதுவும் கண்டறியப்படவில்லை.",
      expandDetails: "முழு காலவரிசையைக் காண்",
      contact: "குடிமகன் தொடர்பு விவரங்கள்",
      detailsTitle: "விவரமான வழக்குக் கோப்பு"
    }
  }[currentLang];

  // Refresh complaints list on mount & when status updates
  const loadList = () => {
    const list = getAllComplaints();
    setComplaints(list);
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleUpdateStatus = (id: string, newStatus: "Pending" | "Reviewed" | "Resolved" | "In Progress" | "Dismissed") => {
    if (newStatus === "Resolved") {
      setResolvingComplaintId(id);
      return;
    }
    if (newStatus === "In Progress") {
      setInProgressComplaintId(id);
      return;
    }
    if (newStatus === "Dismissed") {
      setDismissalComplaintId(id);
      return;
    }
    updateComplaintStatus(id, newStatus);
    loadList(); // Reload from storage
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolvingComplaintId) {
      updateComplaintStatus(resolvingComplaintId, "Resolved", resolutionForm);
      setResolvingComplaintId(null);
      setResolutionForm({
        actionTaken: "",
        assignedOfficer: "",
        completionDate: new Date().toISOString().split("T")[0],
        remarks: ""
      });
      loadList();
    }
  };

  const handleInProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inProgressComplaintId) {
      updateComplaintStatus(inProgressComplaintId, "In Progress", { estimatedResolutionDate });
      setInProgressComplaintId(null);
      setEstimatedResolutionDate(new Date().toISOString().split("T")[0]);
      loadList();
    }
  };

  const handleDismissSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dismissalComplaintId) {
      updateComplaintStatus(dismissalComplaintId, "Dismissed", { dismissalReason });
      setDismissalComplaintId(null);
      setDismissalReason("");
      loadList();
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Compute stats
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const reviewedCount = complaints.filter((c) => c.status === "Reviewed").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  // Filters logic
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  return (
    <div className="admin-viewport">
      {/* Header bar */}
      <header className="admin-header">
        <div className="admin-header__title-group">
          <Shield size={32} style={{ color: "var(--color-saffron)" }} />
          <div>
            <h1 className="admin-header__title">{t.adminCenter}</h1>
            <span className="admin-header__badge">{t.badge}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.6)", fontWeight: "600" }}>
            {t.welcome}: <span style={{ color: "var(--color-gold)" }}>{adminName}</span>
          </span>
          <button className="btn btn--outline" onClick={onLogout} style={{ borderColor: "rgba(239, 68, 68, 0.4)", color: "var(--color-danger)", background: "transparent", padding: "8px 16px" }}>
            <LogOut size={14} />
            <span>{t.logout}</span>
          </button>
        </div>
      </header>

      {/* KPI Stats cards row */}
      <div className="admin-kpi__grid">
        <div className="admin-kpi__card">
          <div className="admin-kpi__icon" style={{ background: "rgba(255, 107, 0, 0.15)", color: "var(--color-saffron)" }}>
            <FileText size={20} />
          </div>
          <div>
            <div className="admin-kpi__val">{totalCount}</div>
            <div className="admin-kpi__label">{t.kpiTotal}</div>
          </div>
        </div>

        <div className="admin-kpi__card">
          <div className="admin-kpi__icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--color-warning)" }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="admin-kpi__val">{pendingCount}</div>
            <div className="admin-kpi__label">{t.kpiPending}</div>
          </div>
        </div>

        <div className="admin-kpi__card">
          <div className="admin-kpi__icon" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            <RefreshCw size={20} />
          </div>
          <div>
            <div className="admin-kpi__val">{reviewedCount}</div>
            <div className="admin-kpi__label">{t.kpiReviewed}</div>
          </div>
        </div>

        <div className="admin-kpi__card">
          <div className="admin-kpi__icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--color-success)" }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="admin-kpi__val">{resolvedCount}</div>
            <div className="admin-kpi__label">{t.kpiResolved}</div>
          </div>
        </div>
      </div>

      {/* Advanced complaint stream card */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2 className="admin-table-title">{t.tableTitle}</h2>
        </div>

        {/* Filters Panel Row */}
        <div className="admin-filter-row">
          <input
            type="text"
            className="admin-search-input"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">{t.statAll}</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="admin-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">{t.catAll}</option>
            <option value="Roads & Infrastructure">Roads & Infrastructure</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Electricity">Electricity</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Agriculture">Agriculture</option>
          </select>

          <select
            className="admin-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">{t.prioAll}</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Table representation */}
        {filteredComplaints.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 0", color: "rgba(255, 255, 255, 0.4)" }}>
            <Search size={40} style={{ opacity: 0.2, marginBottom: "12px" }} />
            <p>{t.emptyState}</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>{t.idCol}</th>
                  <th>{t.citizenCol}</th>
                  <th>{t.catCol}</th>
                  <th>{t.subjCol}</th>
                  <th>{t.statusCol}</th>
                  <th>{t.priorityCol}</th>
                  <th>{t.actionCol}</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((comp) => {
                  const isExpanded = expandedId === comp.id;
                  return (
                    <tr key={comp.id} style={{ cursor: "pointer" }} onClick={() => toggleExpand(comp.id)}>
                      {/* Standard Columns */}
                      <td style={{ fontFamily: "var(--font-accent)", fontWeight: 700, color: "var(--color-saffron)" }}>{comp.id}</td>
                      <td>
                        <div style={{ fontWeight: "600", color: "#ffffff" }}>{comp.citizenName}</div>
                        <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)" }}>{comp.villageArea}</div>
                      </td>
                      <td>{comp.category}</td>
                      <td>
                        <div style={{ fontWeight: "600", color: "#ffffff" }}>{comp.subject}</div>
                        {isExpanded && (
                          <div style={{ marginTop: "12px", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", cursor: "default" }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ fontWeight: "700", color: "var(--color-gold)", marginBottom: "6px" }}>{t.detailsTitle}</div>
                            <p style={{ lineHeight: "1.5", marginBottom: "16px" }}>{comp.description}</p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
                              <div>
                                <span style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "4px" }}>{t.contact}</span>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                  <Smartphone size={14} style={{ color: "var(--color-saffron)" }} />
                                  <span style={{ fontFamily: "var(--font-accent)", fontSize: "0.9rem" }}>{comp.citizenMobile}</span>
                                </div>
                              </div>

                              <div>
                                <span style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "4px" }}>Location Info</span>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                  <MapPin size={14} style={{ color: "var(--color-saffron)" }} />
                                  <span>{comp.villageArea}, Ward {comp.wardNumber || "N/A"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Expanded Status change CTAs */}
                            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                              {comp.status === "Pending" && (
                                <button
                                  className="admin-action-btn admin-action-btn--review"
                                  onClick={() => handleUpdateStatus(comp.id, "Reviewed")}
                                >
                                  {t.markReviewed}
                                </button>
                              )}
                              {comp.status !== "Resolved" && (
                                <button
                                  className="admin-action-btn admin-action-btn--resolve"
                                  onClick={() => handleUpdateStatus(comp.id, "Resolved")}
                                >
                                  {t.markResolved}
                                </button>
                              )}
                              <button
                                className="btn btn--outline"
                                style={{ padding: "6px 14px", fontSize: "0.8rem", height: "auto" }}
                                onClick={() => onSelectComplaint(comp)}
                              >
                                {t.expandDetails}
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
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
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {comp.status === "Pending" && (
                            <button
                              className="admin-action-btn admin-action-btn--review"
                              onClick={() => handleUpdateStatus(comp.id, "Reviewed")}
                              title={t.markReviewed}
                            >
                              <RefreshCw size={14} />
                            </button>
                          )}
                          {comp.status !== "Resolved" && (
                            <button
                              className="admin-action-btn admin-action-btn--resolve"
                              onClick={() => handleUpdateStatus(comp.id, "Resolved")}
                              title={t.markResolved}
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          {comp.status !== "In Progress" && comp.status !== "Resolved" && (
                            <button
                              className="admin-action-btn"
                              style={{ background: "rgba(234, 179, 8, 0.15)", border: "1px solid rgba(234, 179, 8, 0.3)", color: "#eab308" }}
                              onClick={() => handleUpdateStatus(comp.id, "In Progress")}
                              title="Mark In Progress"
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                          {comp.status !== "Closed" && comp.status !== "Rejected" && (
                            <button
                              className="admin-action-btn"
                              style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444" }}
                              onClick={() => handleUpdateStatus(comp.id, "Dismissed")}
                              title="Dismiss Complaint"
                            >
                              <AlertTriangle size={14} />
                            </button>
                          )}
                          <button
                            className="admin-action-btn"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff" }}
                            onClick={() => toggleExpand(comp.id)}
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resolution Modal Overlay */}
      {resolvingComplaintId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div style={{
            background: "var(--color-bg-light)", padding: "24px",
            borderRadius: "12px", width: "100%", maxWidth: "500px",
            color: "var(--color-text)"
          }}>
            <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Resolution Details</h2>
            <form onSubmit={handleResolveSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label>
                <div style={{ marginBottom: "4px", fontSize: "0.9rem", color: "var(--color-text-dim)" }}>Action Taken</div>
                <textarea
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", minHeight: "80px" }}
                  value={resolutionForm.actionTaken}
                  onChange={(e) => setResolutionForm({ ...resolutionForm, actionTaken: e.target.value })}
                  placeholder="Describe the steps taken to resolve the issue"
                />
              </label>
              <label>
                <div style={{ marginBottom: "4px", fontSize: "0.9rem", color: "var(--color-text-dim)" }}>Assigned Officer</div>
                <input
                  type="text" required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  value={resolutionForm.assignedOfficer}
                  onChange={(e) => setResolutionForm({ ...resolutionForm, assignedOfficer: e.target.value })}
                />
              </label>
              <label>
                <div style={{ marginBottom: "4px", fontSize: "0.9rem", color: "var(--color-text-dim)" }}>Completion Date</div>
                <input
                  type="date" required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  value={resolutionForm.completionDate}
                  onChange={(e) => setResolutionForm({ ...resolutionForm, completionDate: e.target.value })}
                />
              </label>
              <label>
                <div style={{ marginBottom: "4px", fontSize: "0.9rem", color: "var(--color-text-dim)" }}>Additional Remarks</div>
                <input
                  type="text"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  value={resolutionForm.remarks}
                  onChange={(e) => setResolutionForm({ ...resolutionForm, remarks: e.target.value })}
                  placeholder="Optional follow-up notes"
                />
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setResolvingComplaintId(null)}
                  style={{ padding: "8px 16px", background: "transparent", border: "1px solid var(--color-text-dim)", color: "var(--color-text)", borderRadius: "4px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", background: "var(--color-saffron)", border: "none", color: "#000", fontWeight: "bold", borderRadius: "4px", cursor: "pointer" }}
                >
                  Confirm & Resolve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In Progress Modal Overlay */}
      {inProgressComplaintId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div style={{
            background: "var(--color-bg-light)", padding: "24px",
            borderRadius: "12px", width: "100%", maxWidth: "400px",
            color: "var(--color-text)"
          }}>
            <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Mark In Progress</h2>
            <form onSubmit={handleInProgressSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label>
                <div style={{ marginBottom: "4px", fontSize: "0.9rem", color: "var(--color-text-dim)" }}>Estimated Resolution Date</div>
                <input
                  type="date" required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  value={estimatedResolutionDate}
                  onChange={(e) => setEstimatedResolutionDate(e.target.value)}
                />
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setInProgressComplaintId(null)}
                  style={{ padding: "8px 16px", background: "transparent", border: "1px solid var(--color-text-dim)", color: "var(--color-text)", borderRadius: "4px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", background: "var(--color-saffron)", border: "none", color: "#000", fontWeight: "bold", borderRadius: "4px", cursor: "pointer" }}
                >
                  Mark In Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dismissal Modal Overlay */}
      {dismissalComplaintId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div style={{
            background: "var(--color-bg-light)", padding: "24px",
            borderRadius: "12px", width: "100%", maxWidth: "400px",
            color: "var(--color-text)"
          }}>
            <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Dismiss Complaint</h2>
            <form onSubmit={handleDismissSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label>
                <div style={{ marginBottom: "4px", fontSize: "0.9rem", color: "var(--color-text-dim)" }}>Reason for Dismissal</div>
                <textarea
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", minHeight: "80px" }}
                  value={dismissalReason}
                  onChange={(e) => setDismissalReason(e.target.value)}
                  placeholder="Explain why this complaint is being dismissed"
                />
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setDismissalComplaintId(null)}
                  style={{ padding: "8px 16px", background: "transparent", border: "1px solid var(--color-text-dim)", color: "var(--color-text)", borderRadius: "4px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", background: "#ef4444", border: "none", color: "#fff", fontWeight: "bold", borderRadius: "4px", cursor: "pointer" }}
                >
                  Dismiss Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
