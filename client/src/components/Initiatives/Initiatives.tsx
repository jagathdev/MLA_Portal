import { useRef } from "react";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { MOCK_INITIATIVES } from "../../mockData";
import "./Initiatives.css";

interface InitiativesProps {
  currentLang: "en" | "ta";
}

export default function Initiatives({ currentLang }: InitiativesProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      title: "Constituency Initiatives",
      subtitle: "Major infrastructure, health, and education works championed by Dr. Kapil MLA.",
      progress: "Completion Progress",
      learnMore: "Learn More",
      prev: "Previous",
      next: "Next"
    },
    ta: {
      title: "தொகுதி மேம்பாட்டுத் திட்டங்கள்",
      subtitle: "டாக்டர் கபில் எம்.எல்.ஏ முன்னெடுத்த முக்கிய சாலைகள், குடிநீர் மற்றும் கல்வி மேம்பாட்டுப் பணிகள்.",
      progress: "திட்ட நிறைவு நிலை",
      learnMore: "மேலும் அறிய",
      prev: "முந்தைய",
      next: "அடுத்தது"
    }
  }[currentLang];

  const scroll = (direction: "left" | "right") => {
    if (trackRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="section initiatives" id="initiatives-section">
      <h2 className="section__title section__title--light">
        {t.title}
        <div className="section__title-underline"></div>
      </h2>
      <p className="section__subtitle">{t.subtitle}</p>

      <div className="initiatives__track-container">
        {/* Horizontal Track */}
        <div className="initiatives__track" ref={trackRef}>
          {MOCK_INITIATIVES.map((init) => (
            <div className="initiatives__card" key={init.id}>
              <div className="initiatives__image-box">
                <img
                  src={init.imageUrl}
                  alt={init.title}
                  className="initiatives__image"
                  referrerPolicy="no-referrer"
                />
                <div className="initiatives__image-overlay"></div>
                <span className="initiatives__tag">{init.category}</span>
              </div>

              <div className="initiatives__content">
                <h3 className="initiatives__card-title">{init.title}</h3>
                <p className="initiatives__card-desc">{init.description}</p>

                {/* Progress bar info */}
                <div className="initiatives__progress-box">
                  <div className="initiatives__progress-labels">
                    <span>{t.progress}</span>
                    <span className="initiatives__progress-val">{init.progress}%</span>
                  </div>
                  <div className="initiatives__progress-track">
                    <div
                      className="initiatives__progress-bar"
                      style={{ width: `${init.progress}%` }}
                    ></div>
                  </div>
                </div>

                <a
                  href="#how-it-works-section"
                  className="btn btn--outline"
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px"
                  }}
                >
                  <span>{t.learnMore}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel buttons */}
        <div className="initiatives__controls">
          <button
            className="initiatives__arrow-btn"
            onClick={() => scroll("left")}
            aria-label={t.prev}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className="initiatives__arrow-btn"
            onClick={() => scroll("right")}
            aria-label={t.next}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
