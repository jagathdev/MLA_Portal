import { useState, useEffect } from "react";
import { Star, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { MOCK_TESTIMONIALS } from "../../mockData";
import "./Testimonials.css";

interface TestimonialsProps {
  currentLang: "en" | "ta";
}

export default function Testimonials({ currentLang }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const t = {
    en: {
      badge: "Citizens Speak",
      title: "Impact & Community Voice",
      subtitle: "See how Dr. Kapil's 'Namma Ooru MLA' Portal directly resolves critical village issues.",
      resolvedIn: "Resolved in",
      days: "days"
    },
    ta: {
      badge: "குடிமக்களின் கருத்து",
      title: "நிர்வாகத்தின் மீதான நம்பகத்தன்மை",
      subtitle: "டாக்டர் கபிலின் 'நம்ம ஊரு எம்.எல்.ஏ' போர்டல் கிராமப்புற பிரச்சினைகளை எவ்வாறு தீர்க்கிறது என்பதைப் பாருங்கள்.",
      resolvedIn: "தீர்க்கப்பட்ட காலம்",
      days: "நாட்கள்"
    }
  }[currentLang];

  // Auto-playing interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MOCK_TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + MOCK_TESTIMONIALS.length) % MOCK_TESTIMONIALS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % MOCK_TESTIMONIALS.length);
  };

  const activeTestimonial = MOCK_TESTIMONIALS[activeIndex];

  return (
    <section className="section testimonials" id="testimonials-section">
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            background: "rgba(255, 107, 0, 0.15)",
            color: "var(--color-saffron)",
            fontSize: "0.85rem",
            fontWeight: "700",
            padding: "6px 16px",
            borderRadius: "50px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            display: "inline-block",
            marginBottom: "16px"
          }}
        >
          {t.badge}
        </span>
      </div>

      <h2 className="section__title section__title--dark" style={{ textAlign: "center" }}>
        {t.title}
        <div className="section__title-underline"></div>
      </h2>
      <p className="section__subtitle" style={{ color: "rgba(255, 255, 255, 0.7)" }}>{t.subtitle}</p>

      <div className="testimonials__carousel">
        <div className="testimonials__card">
          <div className="testimonials__top">
            <div className="testimonials__user-info">
              <span className="testimonials__user-name">{activeTestimonial.name}</span>
              <span className="testimonials__user-location">{activeTestimonial.village}</span>
            </div>

            <div className="testimonials__meta">
              <span className="testimonials__tag">{activeTestimonial.category}</span>
              <div className="testimonials__rating">
                {[...Array(activeTestimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--color-gold)" stroke="none" />
                ))}
              </div>
            </div>
          </div>

          <p className="testimonials__quote">
            {activeTestimonial.quote}
          </p>

          <div className="testimonials__resolved-badge">
            <CheckCircle size={16} />
            <span>
              {t.resolvedIn} {activeTestimonial.daysTaken} {t.days}
            </span>
          </div>
        </div>

        {/* Carousel controls bar */}
        <div className="testimonials__controls">
          <div className="testimonials__dots">
            {MOCK_TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`testimonials__dot ${i === activeIndex ? "testimonials__dot--active" : ""}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Slide ${i + 1}`}
              ></button>
            ))}
          </div>

          <div className="testimonials__arrows">
            <button className="testimonials__arrow" onClick={handlePrev} aria-label="Previous testimonial">
              <ArrowLeft size={18} />
            </button>
            <button className="testimonials__arrow" onClick={handleNext} aria-label="Next testimonial">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
