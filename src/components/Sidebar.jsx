import React from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeSection, onSelect, onLogout }) => {
  const navigate = useNavigate();

  const sections = [
    { id: "home", label: "Home" },
    { id: "aboutMe", label: "About Me" },
    { id: "experiences", label: "Experiences" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contactMessages", label: "Contact Messages" },
    { id: "accountSettings", label: "Account Settings" },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    // Clear token or auth data here if needed
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: 260,
        bgcolor: "background.paper",
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Navigation */}
      <List sx={{ p: 1 }}>
        {sections.map((section) => (
          <ListItemButton
            key={section.id}
            selected={activeSection === section.id}
            onClick={() => onSelect(section.id)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
              },
              "&:hover": {
                bgcolor: "primary.light",
                color: "white",
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            <ListItemText
              primary={section.label}
              primaryTypographyProps={{
                fontWeight: activeSection === section.id ? "bold" : "normal",
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
            "&:hover": {
              boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
            },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
