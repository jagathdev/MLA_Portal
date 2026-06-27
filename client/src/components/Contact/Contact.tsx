import { MapPin, Phone, Mail, Clock, Shield, Flame, PhoneCall } from "lucide-react";
import "./Contact.css";

interface ContactProps {
  currentLang: "en" | "ta";
}

export default function Contact({ currentLang }: ContactProps) {
  const t = {
    en: {
      title: "Contact & Helplines",
      subtitle: "Reach out to our constituency office or contact state emergency services immediately.",
      addressTitle: "Constituency Office",
      addressLabel: "Office Address",
      addressVal: "Dr. Kapil MLA Office, Kamaraj Street, Near Main Bus Stand, Sholinghur, Ranipet District, Tamil Nadu - 631102",
      phoneLabel: "Office Phone",
      phoneVal: "+91 044-27854612 / +91 94444 85612",
      emailLabel: "Official Email",
      emailVal: "office@nammaoorumla.gov.in",
      hoursLabel: "Office Hours",
      hoursVal: "Mon - Sat: 9:00 AM - 6:00 PM (Sunday Closed)",
      mapTitle: "Geographic Location",
      helplineTitle: "Emergency Services",
      police: "Police Department",
      ambulance: "Ambulance / Health",
      mlaOffice: "MLA Emergency Cell"
    },
    ta: {
      title: "தொடர்பு & அவசர எண்கள்",
      subtitle: "எங்கள் தொகுதி அலுவலகத்தைத் தொடர்பு கொள்ளவும் அல்லது மாநில அவசர சேவைகளை உடனடியாக அணுகவும்.",
      addressTitle: "தொகுதி அலுவலகம்",
      addressLabel: "அலுவலக முகவரி",
      addressVal: "டாக்டர் கபில் எம்.எல்.ஏ அலுவலகம், காமராஜர் தெரு, மெயின் பஸ் ஸ்டாண்ட் அருகில், சோளிங்கர், ராணிப்பேட்டை மாவட்டம், தமிழ்நாடு - 631102",
      phoneLabel: "அலுவலக தொலைபேசி",
      phoneVal: "+91 044-27854612 / +91 94444 85612",
      emailLabel: "அதிகாரப்பூர்வ மின்னஞ்சல்",
      emailVal: "office@nammaoorumla.gov.in",
      hoursLabel: "அலுவலக நேரம்",
      hoursVal: "திங்கள் - சனி: காலை 9:00 - மாலை 6:00 (ஞாயிறு விடுமுறை)",
      mapTitle: "வரைபட இருப்பிடம்",
      helplineTitle: "அவசர சேவைகள்",
      police: "காவல் துறை",
      ambulance: "ஆம்புலன்ஸ் / சுகாதாரம்",
      mlaOffice: "MLA அவசர உதவி மையம்"
    }
  }[currentLang];

  return (
    <section className="section contact-section" id="contact-section">
      <h2 className="section__title section__title--light">
        {t.title}
        <div className="section__title-underline"></div>
      </h2>
      <p className="section__subtitle">{t.subtitle}</p>

      <div className="contact__grid">
        {/* Column 1: Physical Address details */}
        <div className="contact__card">
          <h3 className="contact__card-title">
            <MapPin size={20} className="contact__card-title-icon" />
            <span>{t.addressTitle}</span>
          </h3>

          <div className="contact__address-list">
            <div className="contact__address-item">
              <div className="contact__address-icon">
                <MapPin size={18} />
              </div>
              <div>
                <span className="contact__address-label">{t.addressLabel}</span>
                <p className="contact__address-val">{t.addressVal}</p>
              </div>
            </div>

            <div className="contact__address-item">
              <div className="contact__address-icon">
                <Phone size={18} />
              </div>
              <div>
                <span className="contact__address-label">{t.phoneLabel}</span>
                <p className="contact__address-val" style={{ fontFamily: "var(--font-accent)" }}>{t.phoneVal}</p>
              </div>
            </div>

            <div className="contact__address-item">
              <div className="contact__address-icon">
                <Mail size={18} />
              </div>
              <div>
                <span className="contact__address-label">{t.emailLabel}</span>
                <p className="contact__address-val" style={{ color: "var(--color-saffron)" }}>{t.emailVal}</p>
              </div>
            </div>

            <div className="contact__address-item">
              <div className="contact__address-icon">
                <Clock size={18} />
              </div>
              <div>
                <span className="contact__address-label">{t.hoursLabel}</span>
                <p className="contact__address-val">{t.hoursVal}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Google map */}
        <div className="contact__map-container">
          <iframe
            src="https://maps.google.com/maps?q=Sholinghur,%20Tamil%20Nadu&t=&z=13&ie=UTF8&iwloc=&output=embed"
            title={t.mapTitle}
            className="contact__map-iframe"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer"
          ></iframe>
        </div>

        {/* Column 3: Emergency Helplines */}
        <div className="contact__card">
          <h3 className="contact__card-title">
            <PhoneCall size={20} className="contact__card-title-icon" />
            <span>{t.helplineTitle}</span>
          </h3>

          <div className="contact__helpline-list">
            <a href="tel:100" className="contact__helpline-item contact__helpline-item--police">
              <div className="contact__helpline-info">
                <div className="contact__helpline-bullet"></div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="contact__helpline-name">{t.police}</span>
                  <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>State Helpline</span>
                </div>
              </div>
              <span className="contact__helpline-number">100</span>
            </a>

            <a href="tel:108" className="contact__helpline-item contact__helpline-item--ambulance">
              <div className="contact__helpline-info">
                <div className="contact__helpline-bullet"></div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="contact__helpline-name">{t.ambulance}</span>
                  <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>24/7 Dispatch</span>
                </div>
              </div>
              <span className="contact__helpline-number">108</span>
            </a>

            <a href="tel:9444485612" className="contact__helpline-item contact__helpline-item--office">
              <div className="contact__helpline-info">
                <div className="contact__helpline-bullet"></div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="contact__helpline-name">{t.mlaOffice}</span>
                  <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>Direct Redressal</span>
                </div>
              </div>
              <span className="contact__helpline-number">1800-425-612</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
