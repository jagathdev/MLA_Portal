import React, { useState, useEffect } from "react";
import { Upload, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, Flame, Users } from "lucide-react";
import "./ComplaintForm.css";

interface ComplaintFormProps {
  currentLang: "en" | "ta";
  setCurrentView: (view: string) => void;
  userRole: "citizen" | "admin" | null;
  onSubmitComplaint: (complaintData: any) => void;
}

export default function ComplaintForm({
  currentLang,
  setCurrentView,
  userRole,
  onSubmitComplaint
}: ComplaintFormProps) {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [villageArea, setVillageArea] = useState("");
  const [wardNumber, setWardNumber] = useState("");
  const [priority, setPriority] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const t = {
    en: {
      sectionTitle: "Register Your Grievance",
      sectionSubtitle: "Direct communication channel to Dr. Kapil's MLA Constituency Office.",
      title: "File a New Complaint",
      step: "Step 1/3 · Personal Info",
      nameLabel: "Full Name",
      phoneLabel: "Mobile Number",
      catLabel: "Complaint Category",
      subjLabel: "Grievance Subject / Title",
      descLabel: "Detailed Description",
      villageLabel: "Village / Town Area",
      wardLabel: "Ward Number (Optional)",
      priorityLabel: "Priority Level",
      dropzoneMain: "Drag & drop image evidence here or",
      dropzoneBrowse: "click to browse",
      dropzoneLimit: "PNG, JPG up to 5MB",
      submit: "Submit Complaint",
      whyTitle: "Why File a Complaint Here?",
      benefit1Title: "100% Direct MLA Review",
      benefit1Desc: "Dr. Kapil and his central administrative panel directly audit all incoming grievances.",
      benefit2Title: "Fast-Track Field Audits",
      benefit2Desc: "Complaints are assigned to relevant executive officers for field verification within 24 hours.",
      benefit3Title: "Secure Data Isolation",
      benefit3Desc: "Your privacy is protected. Contact details are strictly shielded from public records.",
      liveResolved: "Recently Resolved Case Feed",
      daysAgo: "Resolved in",
      days: "days",
      loginAlert: "Please register or log in first. We will preserve your draft!"
    },
    ta: {
      sectionTitle: "உங்கள் குறையைப் பதிவு செய்க",
      sectionSubtitle: "டாக்டர் கபிலின் சட்டமன்ற உறுப்பினர் தொகுதி அலுவலகத்திற்கான நேரடித் தொடர்பு.",
      title: "புதிய புகார் பதிவு",
      step: "படி 1/3 · தனிநபர் விவரம்",
      nameLabel: "முழு பெயர்",
      phoneLabel: "மொபைல் எண்",
      catLabel: "புகாரின் வகை",
      subjLabel: "புகாரின் தலைப்பு",
      descLabel: "விரிவான விளக்கம்",
      villageLabel: "கிராமம் / நகர்ப்புற பகுதி",
      wardLabel: "வார்டு எண் (விரும்பினால்)",
      priorityLabel: "முன்னுரிமை நிலை",
      dropzoneMain: "புகைப்பட ஆதாரங்களை இங்கே இழுத்துப் போடவும் அல்லது",
      dropzoneBrowse: "தேர்ந்தெடுக்க கிளிக் செய்யவும்",
      dropzoneLimit: "PNG, JPG அதிகபட்சம் 5MB",
      submit: "புகாரைச் சமர்ப்பிக்கவும்",
      whyTitle: "ஏன் இங்கு புகார் செய்ய வேண்டும்?",
      benefit1Title: "100% நேரடி MLA மதிப்பாய்வு",
      benefit1Desc: "டாக்டர் கபில் மற்றும் அவரது நிர்வாகக் குழு அனைத்து புகார்களையும் நேரடியாகத் தணிக்கை செய்கிறது.",
      benefit2Title: "விரைவான கள ஆய்வுகள்",
      benefit2Desc: "24 மணி நேரத்திற்குள் களச் சரிபார்ப்பிற்காகப் புகார்கள் சம்பந்தப்பட்ட அதிகாரிகளுக்கு ஒதுக்கப்படும்.",
      benefit3Title: "பாதுகாப்பான தரவு பாதுகாப்பு",
      benefit3Desc: "உங்கள் தனியுரிமை பாதுகாக்கப்படுகிறது. தொடர்பு விவரங்கள் பொது பதிவுகளிலிருந்து முற்றிலும் மறைக்கப்படும்.",
      liveResolved: "சமீபத்தில் தீர்க்கப்பட்டவை",
      daysAgo: "தீர்க்கப்பட்ட காலம்",
      days: "நாட்கள்",
      loginAlert: "முதலில் கணக்கை உருவாக்கவும் அல்லது உள்நுழையவும். உங்கள் வரைவு பாதுகாப்பாக இருக்கும்!"
    }
  }[currentLang];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      mockUploadFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      mockUploadFile(e.target.files[0]);
    }
  };

  const mockUploadFile = (file: File) => {
    // Generate mock base64/objectUrl thumbnail
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFiles((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName || !mobileNumber || !category || !priority || !subject || !description || !villageArea) {
      setErrorMessage(currentLang === "en" ? "Please fill in all required fields." : "தேவையான அனைத்து புலங்களையும் நிரப்பவும்.");
      return;
    }

    const complaintData = {
      fullName,
      mobileNumber,
      category,
      subject,
      description,
      villageArea,
      wardNumber,
      priority
    };

    if (!userRole) {
      // User is not logged in. Save draft to local state or storage, and route to register
      localStorage.setItem("namma_ooru_complaint_draft", JSON.stringify(complaintData));
      alert(t.loginAlert);
      setCurrentView("register");
      return;
    }

    // Call onSubmitComplaint from App container
    onSubmitComplaint(complaintData);
  };

  // Cycling ticker of mock resolved grievances
  const tickerItems = [
    { title: "Kondapuram Streetlights", text: "Municipal linesmen replaced 4 blown halogen bulbs along the agricultural stretch.", days: 1 },
    { title: "Periyapet Valve Jam", text: "Drinking water supply block cleared. Main valve replaced, regular pressure restored.", days: 2 },
    { title: "Banavaram Drainage Block", text: "Sanitation workers cleared severe silt accumulation in secondary channels.", days: 3 }
  ];

  const [activeTickerIdx, setActiveTickerIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTickerIdx((prev) => (prev + 1) % tickerItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section complaint-form-section" id="complaint-form-section">
      <h2 className="section__title section__title--dark">
        {t.sectionTitle}
        <div className="section__title-underline"></div>
      </h2>
      <p className="section__subtitle" style={{ color: "rgba(255, 255, 255, 0.7)" }}>{t.sectionSubtitle}</p>

      <div className="complaint-form__container">
        {/* Left Side: The form card */}
        <form className="complaint-form__card" onSubmit={handleSubmit}>
          <div className="complaint-form__header">
            <span className="complaint-form__title">{t.title}</span>
            <span className="complaint-form__step-indicator">{t.step}</span>
          </div>

          {errorMessage && (
            <div style={{ display: "flex", gap: "10px", padding: "12px 16px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid var(--color-danger)", borderRadius: "var(--border-radius-sm)", marginBottom: "20px", color: "#ffffff", alignItems: "center", fontSize: "0.9rem" }}>
              <AlertCircle size={18} style={{ color: "var(--color-danger)" }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="complaint-form__row">
            <div className="complaint-form__group">
              <input
                type="text"
                placeholder=" "
                className="complaint-form__input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                id="form-full-name"
              />
              <label htmlFor="form-full-name" className="complaint-form__label">{t.nameLabel} *</label>
            </div>

            <div className="complaint-form__group">
              <input
                type="tel"
                placeholder=" "
                className="complaint-form__input"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                id="form-mobile"
              />
              <label htmlFor="form-mobile" className="complaint-form__label">{t.phoneLabel} *</label>
            </div>
          </div>

          <div className="complaint-form__row">
            <div className="complaint-form__group">
              <select
                className="complaint-form__select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="form-category"
                required
              >
                <option value="" disabled hidden></option>
                <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Public Safety">Public Safety</option>
                <option value="Housing">Housing</option>
                <option value="Employment Scheme">Employment Scheme</option>
                <option value="Transport">Transport</option>
                <option value="Women & Child Welfare">Women & Child Welfare</option>
              </select>
              <label htmlFor="form-category" className="complaint-form__label">{t.catLabel}</label>
            </div>

            <div className="complaint-form__group">
              <select
                className="complaint-form__select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                id="form-priority"
                required
              >
                <option value="" disabled hidden></option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <label htmlFor="form-priority" className="complaint-form__label">{t.priorityLabel}</label>
            </div>
          </div>

          <div className="complaint-form__group">
            <input
              type="text"
              placeholder=" "
              className="complaint-form__input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              id="form-subject"
            />
            <label htmlFor="form-subject" className="complaint-form__label">{t.subjLabel} *</label>
          </div>

          <div className="complaint-form__group">
            <textarea
              placeholder=" "
              className="complaint-form__textarea"
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="form-desc"
            ></textarea>
            <label htmlFor="form-desc" className="complaint-form__label">{t.descLabel} *</label>
          </div>
          <div className="complaint-form__char-counter">
            <span>{description.length} / 1000</span>
          </div>

          <div className="complaint-form__row">
            <div className="complaint-form__group">
              <input
                type="text"
                placeholder=" "
                className="complaint-form__input"
                value={villageArea}
                onChange={(e) => setVillageArea(e.target.value)}
                id="form-village"
              />
              <label htmlFor="form-village" className="complaint-form__label">{t.villageLabel} *</label>
            </div>

            <div className="complaint-form__group">
              <input
                type="text"
                placeholder=" "
                className="complaint-form__input"
                value={wardNumber}
                onChange={(e) => setWardNumber(e.target.value)}
                id="form-ward"
              />
              <label htmlFor="form-ward" className="complaint-form__label">{t.wardLabel}</label>
            </div>
          </div>



          <button type="submit" className="btn btn--primary" style={{ width: "100%", borderRadius: "var(--border-radius-md)", padding: "14px 24px" }}>
            <span>{t.submit}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Right Side: Trust Info Panel & Live Solved Feed */}
        <div className="complaint-form__info-panel">
          <div>
            <h3 className="complaint-form__info-title">{t.whyTitle}</h3>
            <div className="section__title-underline" style={{ margin: "12px 0 30px 0" }}></div>
          </div>

          <div className="complaint-form__benefit-list">
            <div className="complaint-form__benefit-item">
              <div className="complaint-form__benefit-icon">
                <Users size={18} />
              </div>
              <div>
                <h4 className="complaint-form__benefit-title">{t.benefit1Title}</h4>
                <p className="complaint-form__benefit-desc">{t.benefit1Desc}</p>
              </div>
            </div>

            <div className="complaint-form__benefit-item">
              <div className="complaint-form__benefit-icon">
                <Flame size={18} />
              </div>
              <div>
                <h4 className="complaint-form__benefit-title">{t.benefit2Title}</h4>
                <p className="complaint-form__benefit-desc">{t.benefit2Desc}</p>
              </div>
            </div>

            <div className="complaint-form__benefit-item">
              <div className="complaint-form__benefit-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--color-success)" }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="complaint-form__benefit-title">{t.benefit3Title}</h4>
                <p className="complaint-form__benefit-desc">{t.benefit3Desc}</p>
              </div>
            </div>
          </div>

          {/* Scrolling ticker of solved items */}
          <div className="complaint-form__live-feed">
            <div className="complaint-form__live-header">
              <span className="complaint-form__live-indicator">
                <span className="complaint-form__live-indicator-dot"></span>
                <span>{t.liveResolved}</span>
              </span>
              <CheckCircle2 size={16} style={{ color: "var(--color-success)" }} />
            </div>

            <div className="complaint-form__feed-ticker">
              <div className="complaint-form__ticker-item">
                <div className="complaint-form__ticker-top">
                  <span className="complaint-form__ticker-title">{tickerItems[activeTickerIdx].title}</span>
                  <span className="complaint-form__ticker-days">
                    {t.daysAgo} {tickerItems[activeTickerIdx].days} {t.days}
                  </span>
                </div>
                <p className="complaint-form__ticker-text">{tickerItems[activeTickerIdx].text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
