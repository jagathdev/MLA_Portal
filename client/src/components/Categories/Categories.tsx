import React from "react";
import {
  HardHat, Droplet, Zap, Trash2, HeartPulse, GraduationCap,
  Leaf, ShieldAlert, Home, Briefcase, Bus, Heart
} from "lucide-react";
import "./Categories.css";

interface CategoriesProps {
  currentLang: "en" | "ta";
  setCurrentView: (view: string) => void;
  userRole: "citizen" | "admin" | null;
}

export default function Categories({ currentLang, setCurrentView, userRole }: CategoriesProps) {
  const t = {
    en: {
      title: "What Can You Report?",
      subtitle: "Select any category below to register a formal grievance with the MLA constituency cell.",
      roads: "Roads & Infrastructure",
      water: "Water Supply",
      electricity: "Electricity",
      sanitation: "Sanitation",
      healthcare: "Healthcare",
      education: "Education",
      agriculture: "Agriculture",
      safety: "Public Safety",
      housing: "Housing",
      employment: "Employment Scheme",
      transport: "Transport",
      womenWelfare: "Women & Child Welfare"
    },
    ta: {
      title: "புகார் வகைகள்",
      subtitle: "குடிமக்களின் குறைகளை தீர்க்க கீழே உள்ள ஏதேனும் ஒரு வகையைத் தேர்ந்தெடுத்துப் பதிவு செய்யலாம்.",
      roads: "சாலைகள் மற்றும் உள்கட்டமைப்பு",
      water: "குடிநீர் விநியோகம்",
      electricity: "மின்சாரம்",
      sanitation: "சுகாதாரம் & தூய்மை",
      healthcare: "பொது சுகாதாரம்",
      education: "கல்வித் துறை",
      agriculture: "விவசாயம்",
      safety: "பொது பாதுகாப்பு",
      housing: "வீட்டு வசதி",
      employment: "வேலைவாய்ப்புத் திட்டம்",
      transport: "போக்குவரத்து",
      womenWelfare: "பெண்கள் மற்றும் குழந்தைகள் நலம்"
    }
  }[currentLang];

  const categories = [
    { name: t.roads, icon: <HardHat size={28} />, color: "#FF6B00", bg: "rgba(255, 107, 0, 0.08)", count: 2450 },
    { name: t.water, icon: <Droplet size={28} />, color: "#007BFF", bg: "rgba(0, 123, 255, 0.08)", count: 1840 },
    { name: t.electricity, icon: <Zap size={28} />, color: "#F4A500", bg: "rgba(244, 165, 0, 0.08)", count: 1210 },
    { name: t.sanitation, icon: <Trash2 size={28} />, color: "#10B981", bg: "rgba(16, 185, 129, 0.08)", count: 980 },
    { name: t.healthcare, icon: <HeartPulse size={28} />, color: "#EF4444", bg: "rgba(239, 68, 68, 0.08)", count: 540 },
    { name: t.education, icon: <GraduationCap size={28} />, color: "#6366F1", bg: "rgba(99, 102, 241, 0.08)", count: 420 },
    { name: t.agriculture, icon: <Leaf size={28} />, color: "#059669", bg: "rgba(5, 150, 105, 0.08)", count: 350 },
    { name: t.safety, icon: <ShieldAlert size={28} />, color: "#DC2626", bg: "rgba(220, 38, 38, 0.08)", count: 210 },
    { name: t.housing, icon: <Home size={28} />, color: "#78350F", bg: "rgba(120, 53, 15, 0.08)", count: 480 },
    { name: t.employment, icon: <Briefcase size={28} />, color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.08)", count: 670 },
    { name: t.transport, icon: <Bus size={28} />, color: "#0F172A", bg: "rgba(15, 23, 42, 0.08)", count: 190 },
    { name: t.womenWelfare, icon: <Heart size={28} />, color: "#EC4899", bg: "rgba(236, 72, 153, 0.08)", count: 560 }
  ];

  const handleCategoryClick = () => {
    if (userRole === "citizen") {
      setCurrentView("citizen-dashboard");
      setTimeout(() => {
        const el = document.getElementById("new-complaint-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } else {
      setCurrentView("login");
    }
  };

  return (
    <section className="section categories" id="categories-section">
      <h2 className="section__title section__title--light">
        {t.title}
        <div className="section__title-underline"></div>
      </h2>
      <p className="section__subtitle">{t.subtitle}</p>

      <div className="categories__grid">
        {categories.map((cat, idx) => (
          <div
            className="categories__card"
            key={idx}
            style={{
              "--category-color": cat.color,
              "--category-bg": cat.bg
            } as React.CSSProperties}
            onClick={handleCategoryClick}
          >
            <div className="categories__icon-box">
              {cat.icon}
            </div>
            <h3 className="categories__name">{cat.name}</h3>
            <span className="categories__badge">{cat.count} {currentLang === "en" ? "Grievances" : "புகார்கள்"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
