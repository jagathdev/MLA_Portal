import React, { useState } from "react";
import { ArrowLeft, Check, Calendar, MapPin, User, ShieldCheck, Image, ExternalLink, AlertTriangle } from "lucide-react";
import { Complaint, ComplaintStatus } from "../../types";
import "./ComplaintDetail.css";

interface ComplaintDetailProps {
  currentLang: "en" | "ta";
  complaint: Complaint;
  onBack: () => void;
}

export default function ComplaintDetail({ currentLang, complaint, onBack }: ComplaintDetailProps) {
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const t = {
    en: {
      back: "Back to Dashboard",
      ticketDetails: "Grievance Ticket Details",
      assignedDept: "Assigned Department",
      officer: "Executive Field Officer",
      contact: "Department Contact",
      noEvidence: "No photo evidence uploaded.",
      evidenceTitle: "Attached Field Evidence",
      trackingTitle: "Resolution Audit Timeline",
      statusPending: "Complaint Registered",
      statusPendingDesc: "Grievance logged securely with ward verification codes.",
      statusReviewed: "Technical Audit & Review",
      statusReviewedDesc: "MLA administrative cell verified complaints on-site coordinates.",
      statusAssigned: "Assigned to Field Department",
      statusAssignedDesc: "Transferred directly to Ranipet municipal division for clearance works.",
      statusResolved: "Issue Resolved & Cleared",
      statusResolvedDesc: "Field inspection complete. Resolution uploaded and approved by municipal audit.",
      resolutionTitle: "Resolution Audit Report",
      actionTaken: "Action Taken",
      resolvedBy: "Assigned Officer",
      resolvedOn: "Completion Date",
      additionalRemarks: "Additional Remarks"
    },
    ta: {
      back: "டாஷ்போர்டுக்கு திரும்பு",
      ticketDetails: "புகார் டிக்கெட் விவரங்கள்",
      assignedDept: "ஒதுக்கப்பட்ட துறை",
      officer: "கள அதிகாரி",
      contact: "துறை தொடர்பு எண்",
      noEvidence: "புகைப்பட ஆதாரம் எதுவும் இணைக்கப்படவில்லை.",
      evidenceTitle: "இணைக்கப்பட்ட புகைப்படங்கள்",
      trackingTitle: "தீர்வு தணிக்கை காலவரிசை",
      statusPending: "புகார் பதிவு செய்யப்பட்டது",
      statusPendingDesc: "வார்டு சரிபார்ப்புடன் புகார் தரவுதளத்தில் பாதுகாப்பாகப் பதிவு செய்யப்பட்டது.",
      statusReviewed: "மதிப்பாய்வு செய்யப்பட்டது",
      statusReviewedDesc: "விவரங்கள் சரிபார்க்கப்பட்டு எம்.எல்.ஏ அலுவலகக் குழுவால் ஏற்கப்பட்டது.",
      statusAssigned: "துறைக்கு மாற்றப்பட்டது",
      statusAssignedDesc: "களப் பணிகளுக்காக ராணிப்பேட்டை நகராட்சித் துறைக்கு நேரடியாக மாற்றப்பட்டது.",
      statusResolved: "சிக்கல் தீர்க்கப்பட்டது",
      statusResolvedDesc: "களப்பணிகள் முடிவடைந்து, அறிக்கை சமர்ப்பிக்கப்பட்டு, வெற்றிகரமாகத் தீர்க்கப்பட்டது.",
      resolutionTitle: "தீர்வு தணிக்கை அறிக்கை",
      actionTaken: "எடுக்கப்பட்ட நடவடிக்கை",
      resolvedBy: "கள அதிகாரி",
      resolvedOn: "முடிக்கப்பட்ட தேதி",
      additionalRemarks: "கூடுதல் குறிப்புகள்",
      estimatedResDate: "மதிப்பிடப்பட்ட தீர்வு தேதி",
      dismissalReasonLabel: "நிராகரிப்பிற்கான காரணம்"
    }
  }[currentLang];

  // Helper to determine department details based on category
  const getDepartmentDetails = (cat: string) => {
    return {
      dept: "MLA Administration",
      officer: "MLA Admin Team",
      phone: "+91 044-27854612"
    };
  };

  const deptDetails = getDepartmentDetails(complaint.category);

  // Parse chronological state for the timeline steps
  const isReviewed = complaint.status === ComplaintStatus.UNDER_REVIEW || complaint.status === ComplaintStatus.APPROVED || complaint.status === ComplaintStatus.IN_PROGRESS || complaint.status === ComplaintStatus.RESOLVED || complaint.status === ComplaintStatus.CLOSED;
  const isAssigned = complaint.status === ComplaintStatus.IN_PROGRESS || complaint.status === ComplaintStatus.RESOLVED || (complaint.status === ComplaintStatus.CLOSED && complaint.resolutionDetails);
  const isResolved = complaint.status === ComplaintStatus.RESOLVED || complaint.status === ComplaintStatus.CLOSED;

  return (
    <div className="detail-viewport">
      <div style={{ maxWidth: "1300px", margin: "0 auto 30px auto" }}>
        <button className="btn btn--outline" onClick={onBack} style={{ gap: "10px", padding: "10px 18px" }}>
          <ArrowLeft size={16} />
          <span>{t.back}</span>
        </button>
      </div>

      <div className="detail-container">
        {/* Left Card: Ticket Details */}
        <div className="detail-card">
          <div className="detail-card__header">
            <span className="detail-card__id">{complaint.id}</span>
            <span className={`status-badge status-badge--${complaint.status.toLowerCase()}`}>
              {complaint.status}
            </span>
          </div>

          <div className="detail-card__row">
            <span className="detail-card__tag" style={{ background: "rgba(255, 107, 0, 0.08)", color: "var(--color-saffron)" }}>
              {complaint.category}
            </span>
            <span className="detail-card__tag" style={{ background: "rgba(244, 165, 0, 0.08)", color: "var(--color-gold)" }}>
              Priority: {complaint.priority}
            </span>
          </div>

          <h1 className="detail-card__subject">{complaint.subject}</h1>
          <p className="detail-card__desc">{complaint.description}</p>

          <div className="detail-card__meta-box">
            <div>
              <div className="detail-card__meta-label">Village / Area</div>
              <div className="detail-card__meta-val">{complaint.villageArea}</div>
            </div>
            <div>
              <div className="detail-card__meta-label">Ward Number</div>
              <div className="detail-card__meta-val">{complaint.wardNumber || "N/A"}</div>
            </div>
            <div>
              <div className="detail-card__meta-label">{t.assignedDept}</div>
              <div className="detail-card__meta-val" style={{ color: "var(--color-saffron)" }}>{deptDetails.dept}</div>
            </div>
            <div>
              <div className="detail-card__meta-label">{t.officer}</div>
              <div className="detail-card__meta-val">{deptDetails.officer}</div>
            </div>
            <div>
              <div className="detail-card__meta-label">{t.contact}</div>
              <div className="detail-card__meta-val" style={{ fontFamily: "var(--font-accent)" }}>{deptDetails.phone}</div>
            </div>
            <div>
              <div className="detail-card__meta-label">Created At</div>
              <div className="detail-card__meta-val">{complaint.dateSubmitted}</div>
            </div>
          </div>

          {complaint.estimatedResolutionDate && complaint.status === ComplaintStatus.IN_PROGRESS && (
            <div style={{ marginTop: "24px", padding: "16px", background: "rgba(234, 179, 8, 0.05)", border: "1px solid rgba(234, 179, 8, 0.2)", borderRadius: "8px" }}>
              <div style={{ fontSize: "0.8rem", color: "rgba(10, 22, 40, 0.6)", marginBottom: "4px" }}>
                {currentLang === "ta" ? "மதிப்பிடப்பட்ட தீர்வு தேதி" : "Estimated Resolution Date"}
              </div>
              <div style={{ fontSize: "0.95rem", color: "#eab308", fontWeight: 500 }}>
                {complaint.estimatedResolutionDate}
              </div>
            </div>
          )}

          {complaint.dismissalReason && complaint.status === ComplaintStatus.CLOSED && (
            <div style={{ marginTop: "24px", padding: "16px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "1rem", color: "#ef4444", marginTop: 0, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertTriangle size={18} />
                {currentLang === "ta" ? "நிராகரிக்கப்பட்ட புகார்" : "Dismissed Complaint"}
              </h3>
              <div style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "4px" }}>
                {currentLang === "ta" ? "நிராகரிப்பிற்கான காரணம்" : "Reason for Dismissal"}
              </div>
              <div style={{ fontSize: "0.95rem", color: "#ffffff" }}>
                {complaint.dismissalReason}
              </div>
            </div>
          )}

          {complaint.resolutionDetails && complaint.status === ComplaintStatus.RESOLVED && (
            <div style={{ marginTop: "24px", padding: "16px", background: "rgba(22, 163, 74, 0.05)", border: "1px solid rgba(22, 163, 74, 0.2)", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "1rem", color: "#16a34a", marginTop: 0, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={18} />
                {t.resolutionTitle}
              </h3>

              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "rgba(10, 22, 40, 0.6)", marginBottom: "4px" }}>{t.actionTaken}</div>
                  <div style={{ fontSize: "0.95rem", color: "#0a1628", fontWeight: 500 }}>{complaint.resolutionDetails.actionTaken}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(10, 22, 40, 0.6)", marginBottom: "4px" }}>{t.resolvedBy}</div>
                    <div style={{ fontSize: "0.95rem", color: "#0a1628" }}>{complaint.resolutionDetails.assignedOfficer}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(10, 22, 40, 0.6)", marginBottom: "4px" }}>{t.resolvedOn}</div>
                    <div style={{ fontSize: "0.95rem", color: "#0a1628" }}>{complaint.resolutionDetails.completionDate}</div>
                  </div>
                </div>

                {complaint.resolutionDetails.remarks && (
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(10, 22, 40, 0.6)", marginBottom: "4px" }}>{t.additionalRemarks}</div>
                    <div style={{ fontSize: "0.95rem", color: "#0a1628" }}>{complaint.resolutionDetails.remarks}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Card: Resolution Audit Timeline */}
        <div className="timeline-card">
          <h2 className="timeline-card__title">{t.trackingTitle}</h2>

          <div className="timeline-list">
            {/* Step 1: Registered */}
            <div className="timeline-item">
              <div className="timeline-dot timeline-dot--green"></div>
              <div className="timeline-header">
                <span className="timeline-step-title">{t.statusPending}</span>
                <span className="timeline-time">{complaint.dateSubmitted}</span>
              </div>
              <p className="timeline-desc">{t.statusPendingDesc}</p>
            </div>

            {/* Step 2: Technical Review */}
            <div className="timeline-item">
              <div className={`timeline-dot ${isReviewed ? "timeline-dot--green" : "timeline-dot--grey"}`}></div>
              <div className="timeline-header">
                <span className="timeline-step-title" style={{ opacity: isReviewed ? 1 : 0.5 }}>{t.statusReviewed}</span>
                {isReviewed && <span className="timeline-time">{complaint.dateSubmitted}</span>}
              </div>
              <p className="timeline-desc" style={{ opacity: isReviewed ? 1 : 0.5 }}>{t.statusReviewedDesc}</p>
            </div>

            {/* Step 3: Assigned to department */}
            <div className="timeline-item">
              <div className={`timeline-dot ${isAssigned ? "timeline-dot--amber" : "timeline-dot--grey"}`}></div>
              <div className="timeline-header">
                <span className="timeline-step-title" style={{ opacity: isAssigned ? 1 : 0.5 }}>{t.statusAssigned}</span>
              </div>
              <p className="timeline-desc" style={{ opacity: isAssigned ? 1 : 0.5 }}>{t.statusAssignedDesc}</p>
            </div>

            {/* Step 4: Resolved */}
            <div className="timeline-item">
              <div className={`timeline-dot ${isResolved ? (complaint.status === ComplaintStatus.CLOSED ? "timeline-dot--amber" : "timeline-dot--green") : "timeline-dot--grey"}`}></div>
              <div className="timeline-header">
                <span className="timeline-step-title" style={{ opacity: isResolved ? 1 : 0.5 }}>
                  {complaint.status === ComplaintStatus.CLOSED && complaint.dismissalReason ? "Issue Dismissed / Closed" : t.statusResolved}
                </span>
              </div>
              <p className="timeline-desc" style={{ opacity: isResolved ? 1 : 0.5 }}>
                {complaint.status === ComplaintStatus.CLOSED && complaint.dismissalReason ? "Complaint was reviewed and dismissed by administration." : t.statusResolvedDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen light-box popup zoom */}
      {zoomImg && (
        <div className="zoom-modal" onClick={() => setZoomImg(null)}>
          <img src={zoomImg} alt="Evidence Zoomed" className="zoom-modal__img" referrerPolicy="no-referrer" />
        </div>
      )}
    </div>
  );
}
