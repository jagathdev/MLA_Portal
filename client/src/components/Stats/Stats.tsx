import { useState, useEffect } from "react";
import { Users, FileText, CheckCircle2, Clock } from "lucide-react";
import "./Stats.css";

interface StatsProps {
  currentLang: "en" | "ta";
}

export default function Stats({ currentLang }: StatsProps) {
  // Counters states
  const [citizens, setCitizens] = useState(11500);
  const [complaints, setComplaints] = useState(8200);
  const [resolved, setResolved] = useState(6800);
  const [hours, setHours] = useState(24);

  useEffect(() => {
    // Smooth fast count-up on load
    const citizensTarget = 12400;
    const complaintsTarget = 8900;
    const resolvedTarget = 7200;
    const hoursTarget = 48;

    const duration = 1500; // ms
    const steps = 30;
    const stepTime = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCitizens(Math.floor((citizensTarget / steps) * currentStep));
        setComplaints(Math.floor((complaintsTarget / steps) * currentStep));
        setResolved(Math.floor((resolvedTarget / steps) * currentStep));
        setHours(Math.floor((hoursTarget / steps) * currentStep));
      } else {
        setCitizens(citizensTarget);
        setComplaints(complaintsTarget);
        setResolved(resolvedTarget);
        setHours(hoursTarget);
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  const t = {
    en: {
      citizens: "Registered Citizens",
      complaints: "Complaints Filed",
      resolved: "Issues Resolved",
      avgTime: "Avg. Response Time"
    },
    ta: {
      citizens: "பதிவுசெய்த குடிமக்கள்",
      complaints: "பதிவுசெய்த புகார்கள்",
      resolved: "தீர்க்கப்பட்ட சிக்கல்கள்",
      avgTime: "சராசரி பதில் நேரம்"
    }
  }[currentLang];

  return (
    <section className="stats-bar">
      <div className="stats-bar__container">
        {/* Citizens Counter */}
        <div className="stats-bar__card">
          <div className="stats-bar__icon-box">
            <Users size={22} />
          </div>
          <div className="stats-bar__number">
            {citizens.toLocaleString()}+
          </div>
          <div className="stats-bar__label">{t.citizens}</div>
        </div>

        {/* Complaints Counter */}
        <div className="stats-bar__card">
          <div className="stats-bar__icon-box">
            <FileText size={22} />
          </div>
          <div className="stats-bar__number">
            {complaints.toLocaleString()}+
          </div>
          <div className="stats-bar__label">{t.complaints}</div>
        </div>

        {/* Resolved Counter */}
        <div className="stats-bar__card">
          <div className="stats-bar__icon-box" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)" }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="stats-bar__number" style={{ color: "var(--color-success)" }}>
            {resolved.toLocaleString()}+
          </div>
          <div className="stats-bar__label">{t.resolved}</div>
        </div>

        {/* Avg Response Time */}
        <div className="stats-bar__card">
          <div className="stats-bar__icon-box" style={{ background: "rgba(244, 165, 0, 0.1)", color: "var(--color-gold)" }}>
            <Clock size={22} />
          </div>
          <div className="stats-bar__number">
            {hours} {currentLang === "en" ? "Hrs" : "மணி"}
          </div>
          <div className="stats-bar__label">{t.avgTime}</div>
        </div>
      </div>
    </section>
  );
}
