import { useState, useEffect } from "react";
import { ArrowRight, Search, CheckCircle2, ShieldCheck, Zap, ExternalLink } from "lucide-react";
import kapilVijayPhoto from "../../assets/images/kapil_vijay.jpeg";
import "./Hero.css";

interface HeroProps {
  currentLang: "en" | "ta";
  setCurrentView: (view: string) => void;
  userRole: "citizen" | "admin" | null;
}

export default function Hero({ currentLang, setCurrentView, userRole }: HeroProps) {
  const [complaintCount, setComplaintCount] = useState(7180);

  // Animate complaint counter ticking up slightly over time to simulate a "live feed"
  useEffect(() => {
    const interval = setInterval(() => {
      setComplaintCount((prev) => prev + Math.floor(Math.random() * 2));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const t = {
    en: {
      badge: "🏛️ Official MLA Portal · Sholinghur",
      headlineLine1: "Your Voice.",
      headlineLine2: "Your Rights.",
      headlineLine3: "Our Priority.",
      subHeadlineTamil: "மக்களின் குரல், வெளிப்படையான நிர்வாகம்!",
      subHeadlineEnglish: "Bridging citizens and their elected representative with transparency, speed, and accountability. Submit and track complaints in real-time.",
      ctaFile: "File a Complaint",
      ctaTrack: "Track Status",
      resolvedCount: "2,400+ Complaints Resolved",
      avgResponse: "Avg 48hr Response",
      secure: "Secure & Verified",
      liveIndicator: "Live: 12 complaints resolved today",
      mlaTitle: "Dr. Kapil — MLA Sholinghur",
      mlaSub: "Active Portal · Verified Representative",
      floatingStat1: "98% Satisfaction",
      floatingStat2: "81% Resolution Rate"
    },
    ta: {
      badge: "🏛️ அதிகாரப்பூர்வ MLA போர்டல் · சோளிங்கர்",
      headlineLine1: "உங்கள் குரல்.",
      headlineLine2: "உங்கள் உரிமை.",
      headlineLine3: "எங்கள் முன்னுரிமை.",
      subHeadlineTamil: "மக்களின் குரல், வெளிப்படையான நிர்வாகம்!",
      subHeadlineEnglish: "குடிமக்களையும் அவர்கள் தேர்ந்தெடுத்த பிரதிநிதியையும் வெளிப்படைத்தன்மை, வேகம் மற்றும் பொறுப்புக்கூறலுடன் இணைக்கிறது. புகார்களை நிகழ்நேரத்தில் சமர்ப்பித்து கண்காணிக்கவும்.",
      ctaFile: "புகார் பதிவு செய்க",
      ctaTrack: "புகார் நிலை அறிய",
      resolvedCount: "2,400+ புகார்கள் தீர்க்கப்பட்டன",
      avgResponse: "சராசரி 48 மணிநேர பதில்",
      secure: "பாதுகாப்பானது & சரிபார்க்கப்பட்டது",
      liveIndicator: "நேரலை: இன்று 12 புகார்கள் தீர்க்கப்பட்டுள்ளன",
      mlaTitle: "டாக்டர் கபில் — சோளிங்கர் MLA",
      mlaSub: "செயலில் உள்ள போர்டல் · சரிபார்க்கப்பட்ட பிரதிநிதி",
      floatingStat1: "98% திருப்தி",
      floatingStat2: "81% தீர்வு விகிதம்"
    }
  }[currentLang];

  const handleFileComplaintClick = () => {
    if (userRole === "citizen") {
      setCurrentView("citizen-dashboard");
      // Give it a tiny delay to scroll down to the new complaint form
      setTimeout(() => {
        const el = document.getElementById("new-complaint-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      setCurrentView("login");
    }
  };

  const handleTrackStatusClick = () => {
    if (userRole === "citizen") {
      setCurrentView("citizen-dashboard");
    } else {
      setCurrentView("login");
    }
  };

  return (
    <header className="hero">
      {/* Visual background layers */}
      <div className="hero__mesh-overlay"></div>
      <div className="hero__glow-orb hero__glow-orb--1"></div>
      <div className="hero__glow-orb hero__glow-orb--2"></div>

      <div className="hero__container">
        {/* Left Grid: Promotional text, badges & actions */}
        <div className="hero__content">
          <div className="hero__badge-pill">
            <span>{t.badge}</span>
          </div>

          <h1 className="hero__headline">
            {t.headlineLine1}<br />
            {t.headlineLine2}<br />
            <span className="hero__headline-accent">{t.headlineLine3}</span>
          </h1>

          <div className="hero__subheadline">
            <span className="hero__subheadline-tamil">{t.subHeadlineTamil}</span>
            <p>{t.subHeadlineEnglish}</p>
          </div>

          <div className="hero__cta-group">
            <button className="btn btn--primary" onClick={handleFileComplaintClick}>
              <span>{t.ctaFile}</span>
              <ArrowRight size={18} />
            </button>
            <button className="btn btn--outline" onClick={handleTrackStatusClick}>
              <Search size={18} />
              <span>{t.ctaTrack}</span>
            </button>
            <a href="#how-it-works-section" className="btn btn--outline" style={{ padding: "10px 20px" }}>
              <span>Learn More</span>
              <ExternalLink size={18} />
            </a>
          </div>

          {/* Trust points */}
          <div className="hero__trust-badges">
            <div className="hero__trust-item">
              <CheckCircle2 size={18} className="hero__trust-icon" />
              <span>{t.resolvedCount}</span>
            </div>
            <div className="hero__trust-item">
              <Zap size={18} className="hero__trust-icon" style={{ color: "var(--color-gold)" }} />
              <span>{t.avgResponse}</span>
            </div>
            <div className="hero__trust-item">
              <ShieldCheck size={18} className="hero__trust-icon" />
              <span>{t.secure}</span>
            </div>
          </div>
        </div>

        {/* Right Grid: Elite image display */}
        <div className="hero__media">
          <div className="hero__image-frame animate-float">
            <img
              src={kapilVijayPhoto}
              alt="Hon'ble CM Vijay and Dr. Kapil MLA"
              className="hero__mla-image"
              referrerPolicy="no-referrer"
            />
            <div className="hero__image-ribbon">
              <div className="hero__image-name">
                {currentLang === "en" ? "Hon'ble CM Mr. Vijay & Dr. Kapil MLA" : "மாண்புமிகு முதல்வர் விஜய் & டாக்டர் கபில் MLA"}
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
