import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Stats from "./components/Stats/Stats";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Categories from "./components/Categories/Categories";
import ComplaintForm from "./components/ComplaintForm/ComplaintForm";
import Initiatives from "./components/Initiatives/Initiatives";
import AboutMLA from "./components/AboutMLA/AboutMLA";
import Testimonials from "./components/Testimonials/Testimonials";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Auth from "./components/Auth/Auth";
import CitizenDashboard from "./components/CitizenDashboard/CitizenDashboard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import ComplaintDetail from "./components/ComplaintDetail/ComplaintDetail";
import { Complaint } from "./types";
import { saveComplaint, initializeLocalStorage } from "./mockData";

export default function App() {
  const [currentLang, setCurrentLang] = useState<"en" | "ta">("en");
  const [currentView, setCurrentView] = useState<string>("home");

  // User session state
  const [userRole, setUserRole] = useState<"citizen" | "admin" | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userMobile, setUserMobile] = useState<string>("");

  // Track ticket for detailed timeline view
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Initialize local storage database on load
  useEffect(() => {
    initializeLocalStorage();

    // Check for OAuth callback in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const role = urlParams.get("role");
    const name = urlParams.get("name");
    const mobileParam = urlParams.get("mobile");
    
    if (token && role) {
      // Handle OAuth login
      const decodedName = name ? decodeURIComponent(name) : "Citizen";
      const mobile = mobileParam ? decodeURIComponent(mobileParam) : "GOOGLE_AUTH"; 
      
      setUserRole(role as "citizen" | "admin");
      setUserName(decodedName);
      setUserMobile(mobile);
      
      localStorage.setItem("namma_ooru_token", token);
      localStorage.setItem("namma_ooru_user_role", role);
      localStorage.setItem("namma_ooru_user_name", decodedName);
      localStorage.setItem("namma_ooru_user_mobile", mobile);
      
      setCurrentView(role === "admin" ? "admin-dashboard" : "citizen-dashboard");
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Check if user is already signed in
    const cachedRole = localStorage.getItem("namma_ooru_user_role");
    const cachedName = localStorage.getItem("namma_ooru_user_name");
    const cachedMobile = localStorage.getItem("namma_ooru_user_mobile");

    if (cachedRole && cachedName && cachedMobile) {
      setUserRole(cachedRole as "citizen" | "admin");
      setUserName(cachedName);
      setUserMobile(cachedMobile);
      setCurrentView(cachedRole === "admin" ? "admin-dashboard" : "citizen-dashboard");
    }
  }, []);

  const handleLanguageToggle = () => {
    setCurrentLang((prev) => (prev === "en" ? "ta" : "en"));
  };

  const handleLogin = (role: "citizen" | "admin", mobile: string, name: string) => {
    setUserRole(role);
    setUserName(name);
    setUserMobile(mobile);

    localStorage.setItem("namma_ooru_user_role", role);
    localStorage.setItem("namma_ooru_user_name", name);
    localStorage.setItem("namma_ooru_user_mobile", mobile);

    // If there is a draft in localStorage, wait for CitizenDashboard to handle it
    setCurrentView(role === "admin" ? "admin-dashboard" : "citizen-dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegister = (name: string, mobile: string, email: string, village: string, ward: string) => {
    // Save new citizen to localStorage mock
    const newCitizen = { name, mobile, email, village, ward };
    localStorage.setItem("namma_ooru_citizen_profile", JSON.stringify(newCitizen));

    handleLogin("citizen", mobile, name);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName("");
    setUserMobile("");
    localStorage.removeItem("namma_ooru_user_role");
    localStorage.removeItem("namma_ooru_user_name");
    localStorage.removeItem("namma_ooru_user_mobile");
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormComplaintSubmit = (complaintData: any) => {
    // This is called from the public landing page form if user is already logged in
    saveComplaint({
      citizenMobile: userMobile,
      citizenName: userName,
      category: complaintData.category,
      subject: complaintData.subject,
      description: complaintData.description,
      villageArea: complaintData.villageArea,
      wardNumber: complaintData.wardNumber,
      priority: complaintData.priority
    });

    alert(currentLang === "en"
      ? "Grievance submitted successfully! Navigate to your Dashboard to track resolution."
      : "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! உங்கள் டாஷ்போர்டுக்குச் சென்று தீர்வைக் கண்காணிக்கலாம்."
    );

    setCurrentView("citizen-dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setCurrentView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToDashboard = () => {
    setCurrentView(userRole === "admin" ? "admin-dashboard" : "citizen-dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      {/* 1. Header Navigation - Shared everywhere */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentLang={currentLang}
        setCurrentLang={(lang) => setCurrentLang(lang)}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {/* 2. Routing Views */}
      {currentView === "home" && (
        <>
          <Hero currentLang={currentLang} setCurrentView={setCurrentView} userRole={userRole} />
          <Stats currentLang={currentLang} />
          <HowItWorks currentLang={currentLang} />
          <Categories currentLang={currentLang} setCurrentView={setCurrentView} userRole={userRole} />
          <ComplaintForm
            currentLang={currentLang}
            setCurrentView={setCurrentView}
            userRole={userRole}
            onSubmitComplaint={handleFormComplaintSubmit}
          />
          <Initiatives currentLang={currentLang} />
          <AboutMLA currentLang={currentLang} />
          <Testimonials currentLang={currentLang} />
          <Contact currentLang={currentLang} />
          <Footer currentLang={currentLang} setCurrentView={setCurrentView} />
        </>
      )}

      {/* Authentication */}
      {(currentView === "login" || currentView === "register") && (
        <Auth
          currentLang={currentLang}
          onLogin={handleLogin}
          onRegister={handleRegister}
          setCurrentView={setCurrentView}
          initialMode={currentView as "login" | "register"}
        />
      )}

      {/* Citizen Workspace */}
      {currentView === "citizen-dashboard" && (
        <CitizenDashboard
          currentLang={currentLang}
          citizenName={userName}
          citizenMobile={userMobile}
          onLogout={handleLogout}
          onSelectComplaint={handleSelectComplaint}
          onGoHome={handleGoHome}
        />
      )}

      {/* Admin Operations Desk */}
      {currentView === "admin-dashboard" && (
        <AdminDashboard
          currentLang={currentLang}
          adminName={userName}
          onLogout={handleLogout}
          onSelectComplaint={handleSelectComplaint}
          onGoHome={handleGoHome}
        />
      )}

      {/* Unified Timeline Ticket detail screen */}
      {currentView === "detail" && selectedComplaint && (
        <ComplaintDetail
          currentLang={currentLang}
          complaint={selectedComplaint}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}
