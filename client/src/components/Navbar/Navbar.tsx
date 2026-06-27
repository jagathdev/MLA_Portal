import { useState, useEffect } from "react";
import { Globe, LogIn, LogOut, Shield, Menu, X, User } from "lucide-react";
import "./Navbar.css";

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentLang: "en" | "ta";
  setCurrentLang: (lang: "en" | "ta") => void;
  userRole: "citizen" | "admin" | null;
  onLogout: () => void;
}

export default function Navbar({
  currentView,
  setCurrentView,
  currentLang,
  setCurrentLang,
  userRole,
  onLogout
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setCurrentLang(currentLang === "en" ? "ta" : "en");
  };

  const handleNavClick = (view: string, sectionId?: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);

    if (view === "home") {
      setActiveSection(sectionId || "home");
    } else {
      setActiveSection("");
    }

    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const t = {
    en: {
      portalName: "Namma Ooru MLA",
      constituency: "Sholinghur Constituency",
      home: "Home",
      initiatives: "Initiatives",
      fileComplaint: "File Complaint",
      track: "Track Status",
      about: "About",
      contact: "Contact",
      register: "Register",
      login: "Log In",
      logout: "Log Out",
      dashboard: "Dashboard"
    },
    ta: {
      portalName: "நம்ம ஊரு MLA",
      constituency: "சோளிங்கர் தொகுதி",
      home: "முகப்பு",
      initiatives: "திட்டங்கள்",
      fileComplaint: "புகார் பதிவு",
      track: "புகார் நிலை",
      about: "அறிமுகம்",
      contact: "தொடர்பு",
      register: "பதிவு செய்க",
      login: "உள்நுழைக",
      logout: "வெளியேறு",
      dashboard: "டாஷ்போர்டு"
    }
  }[currentLang];

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      {/* Brand logo */}
      <div className="navbar__brand" onClick={() => handleNavClick("home")}>
        <img
          src="/src/assets/images/logo.png"
          alt="Sholinghur Temple"
          className="navbar__emblem"
          style={{ borderRadius: "50%", objectFit: "cover" }}
          referrerPolicy="no-referrer"
        />
        <div className="navbar__title-group">
          <span className="navbar__title">{t.portalName}</span>
          <span className="navbar__subtitle">{t.constituency}</span>
        </div>
      </div>

      {/* Desktop Menu */}
      <ul className="navbar__menu">
        <li className="navbar__menu-item">
          <a
            onClick={() => handleNavClick("home")}
            className={`navbar__menu-link ${currentView === "home" && activeSection === "home" ? "navbar__menu-link--active" : ""}`}
          >
            {t.home}
          </a>
        </li>
        <li className="navbar__menu-item">
          <a
            onClick={() => handleNavClick("home", "initiatives-section")}
            className={`navbar__menu-link ${currentView === "home" && activeSection === "initiatives-section" ? "navbar__menu-link--active" : ""}`}
          >
            {t.initiatives}
          </a>
        </li>
        <li className="navbar__menu-item">
          <a
            onClick={() => handleNavClick(userRole === "citizen" ? "citizen-dashboard" : "login", "complaint-form-section")}
            className={`navbar__menu-link ${currentView === "complaint-form" || activeSection === "complaint-form-section" ? "navbar__menu-link--active" : ""}`}
          >
            {t.fileComplaint}
          </a>
        </li>
        <li className="navbar__menu-item">
          <a
            onClick={() => handleNavClick(userRole === "citizen" ? "citizen-dashboard" : "login")}
            className="navbar__menu-link"
          >
            {t.track}
          </a>
        </li>
        <li className="navbar__menu-item">
          <a
            onClick={() => handleNavClick("home", "about-section")}
            className={`navbar__menu-link ${currentView === "home" && activeSection === "about-section" ? "navbar__menu-link--active" : ""}`}
          >
            {t.about}
          </a>
        </li>
        <li className="navbar__menu-item">
          <a
            onClick={() => handleNavClick("home", "contact-section")}
            className={`navbar__menu-link ${currentView === "home" && activeSection === "contact-section" ? "navbar__menu-link--active" : ""}`}
          >
            {t.contact}
          </a>
        </li>
      </ul>

      {/* Navigation Right Actions */}
      <div className="navbar__actions">
        {/* Language selector */}
        <button className="navbar__lang-btn" onClick={toggleLanguage} aria-label="Toggle language">
          <Globe size={16} />
          <span>{currentLang === "en" ? "தமிழ்" : "English"}</span>
        </button>

        <div className="navbar__actions-desktop">
          {userRole ? (
            <>
              <button
                className="btn btn--outline"
                style={{ padding: "8px 16px", fontSize: "0.85rem", marginRight: "8px" }}
                onClick={() => setCurrentView(userRole === "admin" ? "admin-dashboard" : "citizen-dashboard")}
              >
                {userRole === "admin" ? <Shield size={14} /> : <User size={14} />}
                <span>{t.dashboard}</span>
              </button>
              <button className="navbar__login-link" onClick={onLogout}>
                <LogOut size={16} style={{ display: "inline", marginRight: "4px" }} />
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <button className="navbar__login-link" onClick={() => setCurrentView("login")}>
                <LogIn size={16} style={{ display: "inline", marginRight: "4px" }} />
                {t.login}
              </button>
              <button className="btn btn--primary" style={{ padding: "8px 20px" }} onClick={() => setCurrentView("register")}>
                {t.register}
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${mobileMenuOpen ? "navbar__hamburger--open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className="navbar__hamburger-line"></span>
          <span className="navbar__hamburger-line"></span>
          <span className="navbar__hamburger-line"></span>
        </button>
      </div>

      {/* Mobile full-screen overlay menu */}
      <div className={`navbar__mobile-overlay ${mobileMenuOpen ? "navbar__mobile-overlay--open" : ""}`}>
        <ul style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", padding: 0 }}>
          <li className="navbar__mobile-menu-item">
            <a onClick={() => handleNavClick("home")} className="navbar__mobile-menu-link">
              {t.home}
            </a>
          </li>
          <li className="navbar__mobile-menu-item">
            <a onClick={() => handleNavClick("home", "initiatives-section")} className="navbar__mobile-menu-link">
              {t.initiatives}
            </a>
          </li>
          <li className="navbar__mobile-menu-item">
            <a onClick={() => handleNavClick(userRole === "citizen" ? "citizen-dashboard" : "login", "complaint-form-section")} className="navbar__mobile-menu-link">
              {t.fileComplaint}
            </a>
          </li>
          <li className="navbar__mobile-menu-item">
            <a onClick={() => handleNavClick(userRole === "citizen" ? "citizen-dashboard" : "login")} className="navbar__mobile-menu-link">
              {t.track}
            </a>
          </li>
          <li className="navbar__mobile-menu-item">
            <a onClick={() => handleNavClick("home", "about-section")} className="navbar__mobile-menu-link">
              {t.about}
            </a>
          </li>
          <li className="navbar__mobile-menu-item">
            <a onClick={() => handleNavClick("home", "contact-section")} className="navbar__mobile-menu-link">
              {t.contact}
            </a>
          </li>
          {userRole ? (
            <>
              <li className="navbar__mobile-menu-item">
                <a onClick={() => handleNavClick(userRole === "admin" ? "admin-dashboard" : "citizen-dashboard")} className="navbar__mobile-menu-link" style={{ color: "var(--color-gold)" }}>
                  {t.dashboard}
                </a>
              </li>
              <li className="navbar__mobile-menu-item">
                <a onClick={() => { setMobileMenuOpen(false); onLogout(); }} className="navbar__mobile-menu-link">
                  {t.logout}
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="navbar__mobile-menu-item">
                <a onClick={() => handleNavClick("login")} className="navbar__mobile-menu-link">
                  {t.login}
                </a>
              </li>
              <li className="navbar__mobile-menu-item" style={{ marginTop: "12px" }}>
                <button className="btn btn--primary" onClick={() => handleNavClick("register")}>
                  {t.register}
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
