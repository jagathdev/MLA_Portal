import { UserPlus, FilePlus, Activity, CheckCircle2 } from "lucide-react";
import "./HowItWorks.css";

interface HowItWorksProps {
  currentLang: "en" | "ta";
}

export default function HowItWorks({ currentLang }: HowItWorksProps) {
  const t = {
    en: {
      title: "How It Works",
      subtitle: "Grievance resolution made completely simple, direct, and accountable in 4 easy steps.",
      step1: "Register / Login",
      step1Desc: "Create a verified account using your mobile number and ward details to access the portal.",
      step2: "File Your Complaint",
      step2Desc: "Describe the issue clearly, select a category, pick your location, and attach photo evidence.",
      step3: "Real-Time Tracking",
      step3Desc: "Track your complaint as it is reviewed, approved, and assigned to executive municipal departments.",
      step4: "Issue Resolved",
      step4Desc: "Receive instant SMS/email confirmation once the field work completes and the block is cleared."
    },
    ta: {
      title: "செயல்முறை விளக்கம்",
      subtitle: "புகார் தீர்வு 4 எளிய படிகளில் முற்றிலும் எளிமையானதாகவும், நேரடியானதாகவும், பொறுப்புணர்வுடனும் செய்யப்படுகிறது.",
      step1: "பதிவு / உள்நுழைவு",
      step1Desc: "போர்ட்டலை அணுக உங்கள் மொபைல் எண் மற்றும் வார்டு விவரங்களைப் பயன்படுத்தி சரிபார்க்கப்பட்ட கணக்கை உருவாக்கவும்.",
      step2: "புகார் பதிவு செய்க",
      step2Desc: "சிக்கலைத் தெளிவாக விளக்கி, வகையைத் தேர்ந்தெடுத்து, உங்கள் இருப்பிடத்தைக் குறிப்பிட்டு, புகைப்பட ஆதாரத்தை இணைக்கவும்.",
      step3: "நிகழ்நேர கண்காணிப்பு",
      step3Desc: "உங்கள் புகார் மதிப்பாய்வு செய்யப்பட்டு, அங்கீகரிக்கப்பட்டு, நகராட்சித் துறைகளுக்கு ஒதுக்கப்படுவதைக் கண்காணிக்கவும்.",
      step4: "சிக்கல் தீர்க்கப்பட்டது",
      step4Desc: "களப் பணிகள் முடிவடைந்து சிக்கல் தீர்க்கப்பட்டதும் உடனடி எஸ்எம்எஸ்/மின்னஞ்சல் அறிவிப்பைப் பெறுங்கள்."
    }
  }[currentLang];

  const steps = [
    {
      num: "01",
      title: t.step1,
      desc: t.step1Desc,
      icon: <UserPlus size={28} />
    },
    {
      num: "02",
      title: t.step2,
      desc: t.step2Desc,
      icon: <FilePlus size={28} />
    },
    {
      num: "03",
      title: t.step3,
      desc: t.step3Desc,
      icon: <Activity size={28} />
    },
    {
      num: "04",
      title: t.step4,
      desc: t.step4Desc,
      icon: <CheckCircle2 size={28} />
    }
  ];

  return (
    <section className="section how-it-works" id="how-it-works-section">
      <h2 className="section__title section__title--light">
        {t.title}
        <div className="section__title-underline"></div>
      </h2>
      <p className="section__subtitle">{t.subtitle}</p>

      <div className="how-it-works__timeline">
        {/* Dash line overlay */}
        <div className="how-it-works__line-container">
          <div className="how-it-works__line">
            <div className="how-it-works__moving-dot"></div>
          </div>
        </div>

        {/* Steps */}
        {steps.map((step) => (
          <div className="how-it-works__card" key={step.num}>
            <div className="how-it-works__badge-container">
              <div className="how-it-works__icon-box">
                {step.icon}
              </div>
              <div className="how-it-works__number-badge">{step.num}</div>
            </div>
            <h3 className="how-it-works__card-title">{step.title}</h3>
            <p className="how-it-works__card-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
