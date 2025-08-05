import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import ExperiencesSection from "../components/ExperiencesSection";
import ContactMessagesSection from "../components/ContactMessagesSection";
import AccountSettingsSection from "../components/AccountSettingsSection";
import AboutMeSection from "../components/AboutMeSection";
import Home from "../components/Home";
import { Box } from "@mui/material";

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();

  // Commented out API calls for now
  /*
  useEffect(() => {
    // fetch portfolio data from API
  }, []);
  */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderSection = () => {
    // No loading or error states here to simplify demo
    switch (activeSection) {
      case "skills":
        return <SkillsSection />;
      case "projects":
        return <ProjectsSection />;
      case "experiences":
        return <ExperiencesSection  />;
      case "contactMessages":
        return <ContactMessagesSection />;
      case "accountSettings":
        return <AccountSettingsSection  />;
      case "aboutMe":
        return <AboutMeSection  />;
      default:
        return <Home/>;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} onLogout={handleLogout} />
      <Box sx={{ flexGrow: 1, p: 4, bgcolor: "#f5f5f5" }}>
        {renderSection()}
      </Box>
    </Box>
  );
};

export default DashboardPage;
