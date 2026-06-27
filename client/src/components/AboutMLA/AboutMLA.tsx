import { Award, Heart, Mail, MessageSquare, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import "./AboutMLA.css";

interface AboutMLAProps {
  currentLang: "en" | "ta";
}

export default function AboutMLA({ currentLang }: AboutMLAProps) {
  const t = {
    en: {
      title: "Your Representative",
      subtitle: "Meet Dr. Kapil, Member of Legislative Assembly, Sholinghur Constituency.",
      quote: "I believe a constituency's strength lies in the direct, unhindered power of its citizens to demand progress. This portal ensures your voice is heard directly.",
      vision: "Dr. Kapil, a medical practitioner turned civic leader, is committed to transforming Sholinghur into a model technological and social constituency. By prioritizing grassroots feedback, infrastructure overhaul, and emergency medical outreach, his administration works round-the-clock for civic excellence.",
      badge1Title: "Elected MLA",
      badge1Val: "Sholinghur",
      badge2Title: "Voter Count",
      badge2Val: "3 Lakh +",
      timelineYear1: "2021",
      timelineTitle1: "Historic Mandate",
      timelineDesc1: "Elected to the Tamil Nadu Legislative Assembly with a sweeping mandate to represent Sholinghur.",
      timelineYear2: "2022",
      timelineTitle2: "Healthcare Revamp Initiative",
      timelineDesc2: "Established 6 state-of-the-art emergency Primary Health Centers in water-scarce remote wards.",
      timelineYear3: "2023",
      timelineTitle3: "Infrastructure Capital Push",
      timelineDesc3: "Disbursed ₹15 Crore for critical village road re-tarring, canal desilting, and school upgrading.",
      timelineYear4: "2024",
      timelineTitle4: "Namma Ooru MLA Portal",
      timelineDesc4: "Pioneered this state-of-the-art digital grievance engine to guarantee citizen voice and rapid, audit-backed resolutions.",
      requestCTA: "Request Office Appointment",
      appointmentAlert: "MLA Appointment Request Module: To request a direct personal meeting with Dr. Kapil at his Sholinghur Office, please contact the secretary team at: office@nammaoorumla.gov.in or Call: +91 044-27854612."
    },
    ta: {
      title: "உங்கள் மக்கள் பிரதிநிதி",
      subtitle: "டாக்டர் கபில், சட்டமன்ற உறுப்பினர், சோளிங்கர் தொகுதி பற்றி.",
      quote: "ஒரு தொகுதியின் வலிமை அதன் குடிமக்கள் நேரடியாகவும் தடையின்றியும் முன்னேற்றத்தைக் கோரும் அதிகாரத்தில் உள்ளது என்று நான் நம்புகிறேன். இந்த தளம் உங்கள் குரலை நேரடியாக உறுதி செய்கிறது.",
      vision: "டாக்டர் கபில், மருத்துவத் துறையிலிருந்து மக்கள் சேவைக்கு வந்தவர், சோளிங்கரை ஒரு முன்மாதிரி தொழில்நுட்ப மற்றும் சமூக மேம்பாட்டுத் தொகுதியாக மாற்ற உறுதிபூண்டுள்ளார். அடிமட்ட மக்களின் கருத்துக்கள், உள்கட்டமைப்பு சீரமைப்பு மற்றும் அவசர மருத்துவ உதவிகளுக்கு முன்னுரிமை அளித்து அவரது நிர்வாகம் முழு நேரமும் செயல்படுகிறது.",
      badge1Title: "தேர்ந்தெடுக்கப்பட்ட MLA",
      badge1Val: "சோளிங்கர் தொகுதி",
      badge2Title: "வாக்காளர்கள்",
      badge2Val: "3 லட்சத்திற்கும் மேல்",
      timelineYear1: "2021",
      timelineTitle1: "வரலாற்று வெற்றி",
      timelineDesc1: "சோளிங்கர் தொகுதியை பிரதிநிதித்துவப்படுத்த பெரும் வாக்குகள் வித்தியாசத்தில் தேர்ந்தெடுக்கப்பட்டார்.",
      timelineYear2: "2022",
      timelineTitle2: "சுகாதார சீரமைப்பு முயற்சி",
      timelineDesc2: "பின்தங்கிய கிராமப்புறங்களில் 6 அதிநவீன அவசர ஆரம்ப சுகாதார நிலையங்களை நிறுவினார்.",
      timelineYear3: "2023",
      timelineTitle3: "உள்கட்டமைப்பு மேம்பாடு",
      timelineDesc3: "கிராமப்புற சாலைகள், கால்வாய் தூர்வாருதல் மற்றும் பள்ளிகளை மேம்படுத்துவதற்காக ₹15 கோடி ஒதுக்கீடு செய்தார்.",
      timelineYear4: "2024",
      timelineTitle4: "நம்ம ஊரு MLA போர்டல்",
      timelineDesc4: "குடிமக்களின் குரல் மற்றும் விரைவான தீர்வுகளை உறுதிப்படுத்த இந்த அதிநவீன டிஜிட்டல் குறைகேள் தளத்தை உருவாக்கினார்.",
      requestCTA: "நேரடிச் சந்திப்புக்கு விண்ணப்பிக்க",
      appointmentAlert: "சந்திப்பு கோரிக்கை விவரம்: டாக்டர் கபிலை அவரது சோளிங்கர் அலுவலகத்தில் நேரில் சந்திக்க, அவரது செயலர் குழுவை தொடர்பு கொள்ளவும்: office@nammaoorumla.gov.in அல்லது போன்: +91 044-27854612."
    }
  }[currentLang];

  const handleAppointmentClick = () => {
    alert(t.appointmentAlert);
  };

  return (
    <section className="section about-mla" id="about-section">
      <h2 className="section__title section__title--light">
        {t.title}
        <div className="section__title-underline"></div>
      </h2>
      <p className="section__subtitle">{t.subtitle}</p>

      <div className="about-mla__container">
        {/* Left column: Image & styled frame */}
        <div className="about-mla__media">
          <div className="about-mla__frame">
            <img
              src="/src/assets/images/kapil_photo.png"
              alt="Dr. Kapil MLA portrait"
              className="about-mla__image"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&fit=crop";
              }}
            />
          </div>

          <div className="about-mla__badge about-mla__badge--1">
            <div className="about-mla__badge-icon">
              <Award size={18} />
            </div>
            <div>
              <div className="about-mla__badge-title">{t.badge1Title}</div>
              <div className="about-mla__badge-val">{t.badge1Val}</div>
            </div>
          </div>

          <div className="about-mla__badge about-mla__badge--2">
            <div className="about-mla__badge-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)" }}>
              <Heart size={18} />
            </div>
            <div>
              <div className="about-mla__badge-title">{t.badge2Title}</div>
              <div className="about-mla__badge-val">{t.badge2Val}</div>
            </div>
          </div>
        </div>

        {/* Right column: Quote, timeline, CTAs */}
        <div className="about-mla__content">
          <div className="about-mla__quote-box">
            <span className="about-mla__quote-icon">“</span>
            <blockquote className="about-mla__quote-text">
              {t.quote}
            </blockquote>
          </div>

          <p className="about-mla__vision">{t.vision}</p>

          {/* Achievement timeline */}
          <div className="about-mla__timeline">
            <div className="about-mla__timeline-item">
              <div className="about-mla__timeline-dot"></div>
              <div className="about-mla__timeline-year">{t.timelineYear1}</div>
              <h4 className="about-mla__timeline-title">{t.timelineTitle1}</h4>
              <p className="about-mla__timeline-desc">{t.timelineDesc1}</p>
            </div>

            <div className="about-mla__timeline-item">
              <div className="about-mla__timeline-dot"></div>
              <div className="about-mla__timeline-year">{t.timelineYear2}</div>
              <h4 className="about-mla__timeline-title">{t.timelineTitle2}</h4>
              <p className="about-mla__timeline-desc">{t.timelineDesc2}</p>
            </div>

            <div className="about-mla__timeline-item">
              <div className="about-mla__timeline-dot"></div>
              <div className="about-mla__timeline-year">{t.timelineYear3}</div>
              <h4 className="about-mla__timeline-title">{t.timelineTitle3}</h4>
              <p className="about-mla__timeline-desc">{t.timelineDesc3}</p>
            </div>

            <div className="about-mla__timeline-item">
              <div className="about-mla__timeline-dot"></div>
              <div className="about-mla__timeline-year">{t.timelineYear4}</div>
              <h4 className="about-mla__timeline-title">{t.timelineTitle4}</h4>
              <p className="about-mla__timeline-desc">{t.timelineDesc4}</p>
            </div>
          </div>

          <div className="about-mla__footer">
            <button className="btn btn--primary" onClick={handleAppointmentClick}>
              <Mail size={16} />
              <span>{t.requestCTA}</span>
            </button>

            <div className="about-mla__socials">
              <a href="#" className="about-mla__social-btn" aria-label="Facebook link"><Facebook size={18} /></a>
              <a href="#" className="about-mla__social-btn" aria-label="Twitter link"><Twitter size={18} /></a>
              <a href="#" className="about-mla__social-btn" aria-label="Instagram link"><Instagram size={18} /></a>
              <a href="#" className="about-mla__social-btn" aria-label="Youtube link"><Youtube size={18} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
