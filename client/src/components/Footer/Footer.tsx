import React, { useState } from "react";
import { Mail, Check, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ExternalLink } from "lucide-react";
import logoUrl from "../../assets/images/new-logo.png";
import "./Footer.css";

interface FooterProps {
  currentLang: "en" | "ta";
  setCurrentView: (view: string) => void;
}

export default function Footer({ currentLang, setCurrentView }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const t = {
    en: {
      tagline: "Securing equal rights and swift public resolution for all citizens of Sholinghur Constituency.",
      quickLinks: "Quick Links",
      home: "Home Landing",
      initiatives: "MLA Initiatives",
      fileComplaint: "Submit Grievance",
      about: "About Representative",
      contact: "Office & Helplines",
      citizenLogin: "Citizen Dashboard",
      adminPortal: "Admin Control Panel",
      categories: "Categories",
      roads: "Roads & Public works",
      water: "Water Supply Links",
      electricity: "Electricity Board",
      sanitation: "Sanitation & Waste",
      healthcare: "Primary Health Care",
      agriculture: "Agriculture Schemes",
      newsletterTitle: "Newsletter",
      newsletterDesc: "Subscribe to receive direct updates about Dr. Kapil's initiatives in Sholinghur.",
      subscribe: "Subscribe",
      placeholder: "Enter email address",
      successMsg: "Subscribed successfully!",
      copy: "© 2026 Namma Ooru MLA · Sholinghur Constituency. All Rights Reserved.",
      developer: "Developed by Jagathratchagan V — Software Engineer",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      access: "Accessibility"
    },
    ta: {
      tagline: "சோளிங்கர் தொகுதி குடிமக்கள் அனைவருக்கும் சம உரிமையையும் விரைவான தீர்வையும் உறுதி செய்கிறது.",
      quickLinks: "முக்கிய இணைப்புகள்",
      home: "முகப்புப் பக்கம்",
      initiatives: "சட்டமன்றத் திட்டங்கள்",
      fileComplaint: "குறை தீர்க்கும் பிரிவு",
      about: "மக்கள் பிரதிநிதி பற்றி",
      contact: "அலுவலகத் தொடர்புகள்",
      citizenLogin: "டாஷ்போர்டு",
      adminPortal: "நிர்வாகக் கட்டுப்பாட்டு மையம்",
      categories: "புகார் வகைகள்",
      roads: "சாலைகள் & உள்கட்டமைப்பு",
      water: "குடிநீர் விநியோகம்",
      electricity: "மின்சார வாரியம்",
      sanitation: "சுகாதாரப் பணிகள்",
      healthcare: "ஆரம்ப சுகாதாரப் பணி",
      agriculture: "விவசாயத் திட்டங்கள்",
      newsletterTitle: "செய்தி மடல்",
      newsletterDesc: "சோளிங்கர் தொகுதியில் டாக்டர் கபிலின் திட்டங்கள் குறித்த நேரடித் தகவல்களைப் பெற குழுசேரவும்.",
      subscribe: "பதிவு செய்க",
      placeholder: "மின்னஞ்சலை உள்ளிடவும்",
      successMsg: "வெற்றிகரமாக குழுசேரப்பட்டது!",
      copy: "© 2026 நம்ம ஊரு MLA · சோளிங்கர் சட்டமன்றத் தொகுதி. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      developer: "மென்பொருள் பொறியாளர் ஜெகத்ரட்சகன் வி அவர்களால் உருவாக்கப்பட்டது",
      privacy: "தனியுரிமைக் கொள்கை",
      terms: "விதிமுறைகள்",
      access: "அணுகல்தன்மை"
    }
  }[currentLang];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() === "") return;
    setNewsletterSubscribed(true);
    setNewsletterEmail("");
    setTimeout(() => {
      setNewsletterSubscribed(false);
    }, 4000);
  };

  const handleLinkClick = (view: string, sectionId?: string) => {
    if (view === "home") {
      setCurrentView("home");
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="footer">
      <div className="footer__grid">
        {/* Col 1: Brand & Logo info */}
        <div className="footer__brand">
          <div className="footer__logo-group">
            <img
              src={logoUrl}
              alt="Sholinghur Temple"
              className="footer__logo-emblem"
              style={{ borderRadius: "50%", objectFit: "cover" }}
              referrerPolicy="no-referrer"
            />
            <span className="footer__logo-text">Namma Ooru MLA</span>
          </div>
          <p className="footer__tagline">{t.tagline}</p>
        </div>

        {/* Col 2: Navigation link shortcuts */}
        <div>
          <h3 className="footer__title">{t.quickLinks}</h3>
          <ul className="footer__links">
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => handleLinkClick("home")}>{t.home}</a>
            </li>
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => handleLinkClick("home", "initiatives-section")}>{t.initiatives}</a>
            </li>
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => handleLinkClick("home", "about-section")}>{t.about}</a>
            </li>
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => handleLinkClick("home", "contact-section")}>{t.contact}</a>
            </li>
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => handleLinkClick("login")}>{t.citizenLogin}</a>
            </li>
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => { setCurrentView("login"); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ color: "var(--color-gold)", fontWeight: "600" }}>{t.adminPortal}</a>
            </li>
          </ul>
        </div>

        {/* Col 3: Categories link shortcuts */}
        <div>
          <h3 className="footer__title">{t.categories}</h3>
          <ul className="footer__links">
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => handleLinkClick("home", "categories-section")}>{t.roads}</a>
            </li>
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => handleLinkClick("home", "categories-section")}>{t.water}</a>
            </li>
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => handleLinkClick("home", "categories-section")}>{t.electricity}</a>
            </li>
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => handleLinkClick("home", "categories-section")}>{t.sanitation}</a>
            </li>
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => handleLinkClick("home", "categories-section")}>{t.healthcare}</a>
            </li>
            <li className="footer__link-item">
              <a className="footer__link" onClick={() => handleLinkClick("home", "categories-section")}>{t.agriculture}</a>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter field */}
        <div className="footer__newsletter">
          <h3 className="footer__title">{t.newsletterTitle}</h3>
          <p className="footer__newsletter-desc">{t.newsletterDesc}</p>

          {newsletterSubscribed ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--color-success)", fontSize: "0.85rem", fontWeight: "600" }}>
              <Check size={16} />
              <span>{t.successMsg}</span>
            </div>
          ) : (
            <form className="footer__newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder={t.placeholder}
                className="footer__newsletter-input"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="footer__newsletter-btn">
                {t.subscribe}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar: Copyright / credits */}
      <div className="footer__bottom">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span className="footer__copy">{t.copy}</span>
          <span className="footer__copy" style={{ color: "var(--color-gold)", fontWeight: "500" }}>{t.developer}</span>
        </div>

        <ul className="footer__bottom-links">
          <li><a href="#" className="footer__bottom-link">{t.privacy}</a></li>
          <li><a href="#" className="footer__bottom-link">{t.terms}</a></li>
          <li><a href="#" className="footer__bottom-link">{t.access}</a></li>
        </ul>
      </div>
    </footer>
  );
}
