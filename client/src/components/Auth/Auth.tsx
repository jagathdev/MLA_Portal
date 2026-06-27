import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, KeyRound, Smartphone, Shield, ArrowRight, UserPlus, Sparkles, Check, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import "./Auth.css";

interface AuthProps {
  currentLang: "en" | "ta";
  onLogin: (role: "citizen" | "admin", mobile: string, name: string) => void;
  onRegister: (name: string, mobile: string, email: string, village: string, ward: string) => void;
  setCurrentView: (view: string) => void;
  initialMode?: "login" | "register";
}

export default function Auth({ currentLang, onLogin, onRegister, setCurrentView, initialMode = "login" }: AuthProps) {
  // Global auth toggle: "login" | "register"
  const [authMode, setAuthMode] = useState<"login" | "register">(initialMode);

  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  // Login variables
  const [loginTab, setLoginTab] = useState<"password" | "admin">("password");
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register variables
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regVillage, setRegVillage] = useState("");
  const [regWard, setRegWard] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [draftExists, setDraftExists] = useState(false);

  const t = {
    en: {
      promoTitle: "Accountable Civic Technology",
      promoSubtitle: "Access the unified dashboard of Sholinghur Constituency.",
      promoDesc: "Sign in to easily submit complaints, track real-time field-audit reports, and view historical developmental projects near your local area.",
      resolvedToday: "7,200+ Cases Settled",
      resolvedTodayDesc: "Verified by municipal departments",
      loginTitle: "Citizen Portal Access",
      registerTitle: "Citizen Registration",
      loginSub: "Access secure, direct communication with Dr. Kapil MLA Cell.",
      regSub: "Create an account to submit and track grievances.",
      tabPass: "Password Login",
      tabOtp: "OTP Login",
      tabAdmin: "Admin Portal",
      phoneLabel: "Email or Mobile Number",
      passLabel: "Account Password",
      rememberMe: "Remember me",
      forgotPass: "Forgot password?",
      submitLogin: "Sign In Securely",
      continueWith: "or continue with",
      googleSign: "Sign in with Google",
      noAccount: "Don't have an account?",
      yesAccount: "Already have an account?",
      regCTA: "Register Citizen Account",
      loginCTA: "Sign In Here",
      otpSentMsg: "A 6-digit secure code has been sent to your mobile.",
      verifyOtp: "Verify & Log In",
      resendOtp: "Resend OTP",
      regStep1: "Personal Info",
      regStep2: "Location Area",
      regStep3: "Secure Access",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      villageLabel: "Village / Town Ward",
      wardLabel: "Ward Number",
      confirmPassLabel: "Confirm Password",
      nextStep: "Next Step",
      completeReg: "Complete Registration",
      draftBanner: "Draft Complaint Detected! Register now to automatically submit it.",
      whyTitle: "Why Register?",
      why1: "Submit unlimited complaints online",
      why2: "Track real-time complaint status",
      why3: "Get email/SMS alerts on every update",
      why4: "View complete complaint history"
    },
    ta: {
      promoTitle: "பொறுப்புள்ள மக்கள் தொழில்நுட்பம்",
      promoSubtitle: "சோளிங்கர் தொகுதியின் ஒருங்கிணைந்த தளம்.",
      promoDesc: "புகார்களை எளிதாகச் சமர்ப்பிக்கவும், நிகழ்நேர கள ஆய்வு அறிக்கைகளைக் கண்காணிக்கவும் மற்றும் உங்கள் பகுதியில் உள்ள திட்டங்களைப் பார்க்கவும் உள்நுழையவும்.",
      resolvedToday: "7,200+ தீர்க்கப்பட்டவை",
      resolvedTodayDesc: "நகராட்சித் துறைகளால் சரிபார்க்கப்பட்டது",
      loginTitle: "குடிமகன் உள்நுழைவு",
      registerTitle: "குடிமகன் பதிவு",
      loginSub: "டாக்டர் கபில் எம்.எல்.ஏ அலுவலகத்துடன் பாதுகாப்பான, நேரடித் தொடர்பைப் பெறுங்கள்.",
      regSub: "புகார்களைச் சமர்ப்பிக்க மற்றும் கண்காணிக்க ஒரு கணக்கை உருவாக்கவும்.",
      tabPass: "கடவுச்சொல்",
      tabOtp: "OTP உள்நுழைவு",
      tabAdmin: "நிர்வாகி",
      phoneLabel: "மின்னஞ்சல் அல்லது மொபைல் எண்",
      passLabel: "கணக்கு கடவுச்சொல்",
      rememberMe: "என்னை நினைவில் கொள்",
      forgotPass: "கடவுச்சொல் மறந்துவிட்டதா?",
      submitLogin: "பாதுகாப்பாக உள்நுழைக",
      continueWith: "அல்லது இதைப் பயன்படுத்தவும்",
      googleSign: "கூகுள் மூலம் உள்நுழைக",
      noAccount: "கணக்கு இல்லையா?",
      yesAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
      regCTA: "புதிய கணக்கை உருவாக்கவும்",
      loginCTA: "இங்கே உள்நுழையவும்",
      otpSentMsg: "உங்கள் மொபைல் எண்ணுக்கு 6 இலக்க குறியீடு அனுப்பப்பட்டுள்ளது.",
      verifyOtp: "சரிபார்த்து உள்நுழையவும்",
      resendOtp: "மீண்டும் அனுப்பவும்",
      regStep1: "தனிநபர் விவரம்",
      regStep2: "இருப்பிட விவரம்",
      regStep3: "கடவுச்சொல்",
      nameLabel: "முழு பெயர்",
      emailLabel: "மின்னஞ்சல் முகவரி",
      villageLabel: "கிராமம் / வார்டு",
      wardLabel: "வார்டு எண்",
      confirmPassLabel: "கடவுச்சொல்லை உறுதிப்படுத்துக",
      nextStep: "அடுத்த படி",
      completeReg: "பதிவை நிறைவு செய்க",
      draftBanner: "வரைவு புகார் கண்டறியப்பட்டது! உடனடியாகப் பதிவு செய்து சமர்ப்பிக்கவும்.",
      whyTitle: "ஏன் பதிவு செய்ய வேண்டும்?",
      why1: "வரம்பற்ற புகார்களை ஆன்லைனில் பதிவு செய்யலாம்",
      why2: "புகாரின் நிலையை நேரலையாக அறியலாம்",
      why3: "ஒவ்வொரு மாற்றத்திற்கும் மின்னஞ்சல்/எஸ்எம்எஸ் அறிவிப்பு",
      why4: "முழுமையான புகார்களின் வரலாற்றைக் காணலாம்"
    }
  }[currentLang];

  useEffect(() => {
    // Check if draft exists in storage
    const draft = localStorage.getItem("namma_ooru_complaint_draft");
    if (draft) {
      setDraftExists(true);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!loginMobile) {
      setErrorMessage(currentLang === "en" ? "Email or mobile number is required." : "மின்னஞ்சல் அல்லது மொபைல் எண் தேவை.");
      return;
    }

    if (!loginPassword) {
      setErrorMessage(currentLang === "en" ? "Password is required." : "கடவுச்சொல் தேவை.");
      return;
    }

    try {
      const response = await fetch("https://mla-portal-server.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: loginMobile,
          password: loginPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || (currentLang === "en" ? "Invalid credentials." : "தவறான உள்நுழைவு விவரங்கள்."));
      }

      const { token, user } = result.data;
      localStorage.setItem("namma_ooru_jwt_token", token);

      // Store user profile details in localStorage to sync with the frontend's mock database
      const profile = {
        fullName: user.name,
        mobileNumber: user.mobile,
        email: user.email,
        villageArea: user.village || "",
        wardNumber: user.ward || "",
        cityTown: user.city || "Sholinghur",
        constituency: "Sholinghur",
      };
      localStorage.setItem("namma_ooru_citizen_profile", JSON.stringify(profile));

      onLogin(user.role, user.mobile, user.name);
    } catch (err: any) {
      setErrorMessage(err.message || (currentLang === "en" ? "Connection failed." : "இணைப்பு தோல்வியடைந்தது."));
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (registerStep === 1) {
      if (!regName || !regMobile || !regEmail) {
        setErrorMessage(currentLang === "en" ? "Please fill out all personal details." : "அனைத்து தனிநபர் விவரங்களையும் நிரப்பவும்.");
        return;
      }
      setRegisterStep(2);
    } else if (registerStep === 2) {
      if (!regVillage) {
        setErrorMessage(currentLang === "en" ? "Please enter your village/ward name." : "உங்கள் கிராமம்/வார்டு பெயரை உள்ளிடவும்.");
        return;
      }
      setRegisterStep(3);
    } else if (registerStep === 3) {
      if (!regPassword || !regConfirmPassword) {
        setErrorMessage(currentLang === "en" ? "Password fields are required." : "கடவுச்சொல் புலங்கள் தேவை.");
        return;
      }
      if (regPassword !== regConfirmPassword) {
        setErrorMessage(currentLang === "en" ? "Passwords do not match." : "கடவுச்சொற்கள் பொருந்தவில்லை.");
        return;
      }

      try {
        const response = await fetch("https://mla-portal-server.onrender.com/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: regName,
            mobile: regMobile,
            email: regEmail,
            password: regPassword,
            village: regVillage,
            ward: regWard,
            role: "citizen",
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || (currentLang === "en" ? "Registration failed." : "பதிவு தோல்வியடைந்தது."));
        }

        const { token, user } = result.data;
        localStorage.setItem("namma_ooru_jwt_token", token);

        // Store user profile details in localStorage to sync with the frontend's mock database
        const profile = {
          fullName: user.name,
          mobileNumber: user.mobile,
          email: user.email,
          villageArea: user.village || "",
          wardNumber: user.ward || "",
          cityTown: user.city || "Sholinghur",
          constituency: "Sholinghur",
        };
        localStorage.setItem("namma_ooru_citizen_profile", JSON.stringify(profile));

        onLogin(user.role, user.mobile, user.name);
      } catch (err: any) {
        setErrorMessage(err.message || (currentLang === "en" ? "Connection failed." : "இணைப்பு தோல்வியடைந்தது."));
      }
    }
  };

  return (
    <div className="auth-viewport">
      <div className="auth-viewport__glow"></div>

      {authMode === "login" ? (
        <div className="auth-card">
          {/* Left Panel */}
          <div className="auth-card__left">
            <div className="auth-card__left-glow"></div>
            <div className="auth-card__brand" onClick={() => setCurrentView("home")}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/81/Tamil_Nadu_State_Emblem.svg"
                alt="TN Government emblem"
                className="auth-card__brand-logo"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="auth-card__brand-title">Namma Ooru MLA</div>
                <div className="auth-card__brand-sub">Sholinghur Constituency Cell</div>
              </div>
            </div>

            <div className="auth-card__promo">
              <h2 className="auth-card__promo-heading">
                {t.promoTitle} <span className="auth-card__promo-highlight">{currentLang === "en" ? "Redefined" : "புதுப்பிக்கப்பட்டது"}</span>.
              </h2>
              <p className="auth-card__promo-desc">{t.promoDesc}</p>

              <div className="auth-card__stat-bullet">
                <div className="auth-card__stat-icon">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="auth-card__stat-val">{t.resolvedToday}</div>
                  <div className="auth-card__stat-label">{t.resolvedTodayDesc}</div>
                </div>
              </div>
            </div>

            <div className="auth-card__left-copy">
              <span>Government of Tamil Nadu Civic Grievance Portal. Protected by high-grade isolated state database protocols.</span>
            </div>
          </div>

          {/* Right Panel */}
          <div className="auth-card__right">
            {draftExists && (
              <div style={{ display: "flex", gap: "10px", padding: "12px 16px", background: "rgba(244, 165, 0, 0.15)", border: "1px solid var(--color-gold)", borderRadius: "var(--border-radius-sm)", marginBottom: "20px", color: "#ffffff", alignItems: "center", fontSize: "0.85rem" }}>
                <Sparkles size={18} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                <span>{t.draftBanner}</span>
              </div>
            )}

            <div className="auth-card__right-header">
              <h1 className="auth-card__welcome">{t.loginTitle}</h1>
              <p className="auth-card__subtitle">{t.loginSub}</p>
            </div>

            {/* Selector Tabs */}
            <div className="auth-card__tabs">
              <button
                type="button"
                className={`auth-card__tab ${loginTab === "password" ? "auth-card__tab--active" : ""}`}
                onClick={() => { setLoginTab("password"); setErrorMessage(""); }}
              >
                {currentLang === "en" ? "Citizen Portal" : "குடிமகன் உள்நுழைவு"}
              </button>
              <button
                type="button"
                className={`auth-card__tab ${loginTab === "admin" ? "auth-card__tab--active" : ""}`}
                onClick={() => { setLoginTab("admin"); setErrorMessage(""); }}
              >
                {t.tabAdmin}
              </button>
            </div>

            {errorMessage && (
              <div style={{ display: "flex", gap: "10px", padding: "12px 16px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid var(--color-danger)", borderRadius: "var(--border-radius-sm)", marginBottom: "20px", color: "#ffffff", alignItems: "center", fontSize: "0.85rem" }}>
                <AlertCircle size={18} style={{ color: "var(--color-danger)", flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form className="auth-card__form" onSubmit={handleLoginSubmit}>
              {/* Phone or Email entry field */}
              <div className="auth-card__group">
                <input
                  type="text"
                  placeholder=" "
                  className="auth-card__input"
                  value={loginMobile}
                  onChange={(e) => setLoginMobile(e.target.value)}
                  id="login-identifier"
                />
                <label htmlFor="login-identifier" className="auth-card__label">{t.phoneLabel}</label>
              </div>

              {/* Password tab fields */}
              <div className="auth-card__group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  className="auth-card__input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  id="login-pass"
                />
                <label htmlFor="login-pass" className="auth-card__label">{t.passLabel}</label>
                <button
                  type="button"
                  className="auth-card__toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Extras checkbox bar */}
              <div className="auth-card__extras">
                <label className="auth-card__remember">
                  <input type="checkbox" className="auth-card__checkbox" />
                  <span>{t.rememberMe}</span>
                </label>
                <a href="#" className="auth-card__forgot">{t.forgotPass}</a>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn--primary auth-card__submit-btn">
                <span>{t.submitLogin}</span>
                <ArrowRight size={18} />
              </button>

              <div className="auth-card__divider">{t.continueWith}</div>

              <button
                type="button"
                className="auth-card__oauth"
                onClick={() => { window.location.href = "https://mla-portal-server.onrender.com/api/auth/google"; }}
                disabled={isLoading}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google logo"
                  style={{ width: "18px", height: "18px" }}
                  referrerPolicy="no-referrer"
                />
                <span>{t.googleSign}</span>
              </button>

              <p className="auth-card__footer-text">
                {t.noAccount}{" "}
                <span className="auth-card__footer-link" onClick={() => { setAuthMode("register"); setErrorMessage(""); }}>
                  {t.regCTA}
                </span>
              </p>
            </form>
          </div>
        </div>
      ) : (
        /* Register Layout */
        <div className="register-layout">
          {/* Sidebar */}
          <div className="register-sidebar">
            <div className="register-steps">
              <div className="auth-card__brand" onClick={() => setCurrentView("home")} style={{ marginBottom: "20px" }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/81/Tamil_Nadu_State_Emblem.svg"
                  alt="TN emblem"
                  className="auth-card__brand-logo"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="auth-card__brand-title">Namma Ooru MLA</div>
                  <div className="auth-card__brand-sub">Sholinghur Constituency Cell</div>
                </div>
              </div>

              <div className={`register-step ${registerStep === 1 ? "register-step--active" : registerStep > 1 ? "register-step--completed" : ""}`}>
                <div className="register-step__num">1</div>
                <div>
                  <div className="register-step__title">{t.regStep1}</div>
                  <div className="register-step__desc">Name, Mobile & Email</div>
                </div>
              </div>

              <div className={`register-step ${registerStep === 2 ? "register-step--active" : registerStep > 2 ? "register-step--completed" : ""}`}>
                <div className="register-step__num">2</div>
                <div>
                  <div className="register-step__title">{t.regStep2}</div>
                  <div className="register-step__desc">Village & Ward Details</div>
                </div>
              </div>

              <div className={`register-step ${registerStep === 3 ? "register-step--active" : ""}`}>
                <div className="register-step__num">3</div>
                <div>
                  <div className="register-step__title">{t.regStep3}</div>
                  <div className="register-step__desc">Secure Account Access</div>
                </div>
              </div>
            </div>

            {/* Why register panel */}
            <div className="register-sidebar__info">
              <h3 className="register-sidebar__info-title">{t.whyTitle}</h3>
              <ul className="register-sidebar__info-list">
                <li className="register-sidebar__info-item">
                  <span className="register-sidebar__info-icon">✓</span>
                  <span>{t.why1}</span>
                </li>
                <li className="register-sidebar__info-item">
                  <span className="register-sidebar__info-icon">✓</span>
                  <span>{t.why2}</span>
                </li>
                <li className="register-sidebar__info-item">
                  <span className="register-sidebar__info-icon">✓</span>
                  <span>{t.why3}</span>
                </li>
                <li className="register-sidebar__info-item">
                  <span className="register-sidebar__info-icon">✓</span>
                  <span>{t.why4}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Panel */}
          <div className="auth-card__right">
            <div className="auth-card__right-header">
              <h1 className="auth-card__welcome">{t.registerTitle}</h1>
              <p className="auth-card__subtitle">{t.regSub}</p>
            </div>

            {errorMessage && (
              <div style={{ display: "flex", gap: "10px", padding: "12px 16px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid var(--color-danger)", borderRadius: "var(--border-radius-sm)", marginBottom: "20px", color: "#ffffff", alignItems: "center", fontSize: "0.85rem" }}>
                <AlertCircle size={18} style={{ color: "var(--color-danger)", flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form className="auth-card__form" onSubmit={handleRegisterSubmit}>
              {/* Step 1 Fields */}
              {registerStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="auth-card__group">
                    <input
                      type="text"
                      placeholder=" "
                      className="auth-card__input"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      id="reg-name"
                    />
                    <label htmlFor="reg-name" className="auth-card__label">{t.nameLabel} *</label>
                  </div>

                  <div className="auth-card__group">
                    <input
                      type="tel"
                      placeholder=" "
                      className="auth-card__input"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      id="reg-phone"
                    />
                    <label htmlFor="reg-phone" className="auth-card__label">{t.phoneLabel} *</label>
                  </div>

                  <div className="auth-card__group">
                    <input
                      type="email"
                      placeholder=" "
                      className="auth-card__input"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      id="reg-email"
                    />
                    <label htmlFor="reg-email" className="auth-card__label">{t.emailLabel} *</label>
                  </div>
                </div>
              )}

              {/* Step 2 Fields */}
              {registerStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="auth-card__group">
                    <input
                      type="text"
                      placeholder=" "
                      className="auth-card__input"
                      value={regVillage}
                      onChange={(e) => setRegVillage(e.target.value)}
                      id="reg-village"
                    />
                    <label htmlFor="reg-village" className="auth-card__label">{t.villageLabel} *</label>
                  </div>

                  <div className="auth-card__group">
                    <input
                      type="text"
                      placeholder=" "
                      className="auth-card__input"
                      value={regWard}
                      onChange={(e) => setRegWard(e.target.value)}
                      id="reg-ward"
                    />
                    <label htmlFor="reg-ward" className="auth-card__label">{t.wardLabel} (Optional)</label>
                  </div>
                </div>
              )}

              {/* Step 3 Fields */}
              {registerStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="auth-card__group">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      className="auth-card__input"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      id="reg-pass"
                    />
                    <label htmlFor="reg-pass" className="auth-card__label">{t.passLabel} *</label>
                    <button
                      type="button"
                      className="auth-card__toggle-pass"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="auth-card__group">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      className="auth-card__input"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      id="reg-conf"
                    />
                    <label htmlFor="reg-conf" className="auth-card__label">{t.confirmPassLabel} *</label>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn--primary auth-card__submit-btn">
                <span>{registerStep === 3 ? t.completeReg : t.nextStep}</span>
                <ArrowRight size={18} />
              </button>

              <p className="auth-card__footer-text">
                {t.yesAccount}{" "}
                <span className="auth-card__footer-link" onClick={() => { setAuthMode("login"); setErrorMessage(""); setRegisterStep(1); }}>
                  {t.loginCTA}
                </span>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
