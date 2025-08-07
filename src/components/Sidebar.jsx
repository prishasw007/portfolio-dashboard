import React from "react";
import { List, ListItemButton, ListItemText, Divider, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeSection, onSelect, onLogout }) => {
  const navigate = useNavigate();

  const sections = [
  { id: "home", label: "Home"},
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
        width: 240,
        bgcolor: "background.paper",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
      }}
    >
      <List>
        {sections.map((section) => (
          <ListItemButton
            key={section.id}
            selected={activeSection === section.id}
            onClick={() => onSelect(section.id)}
          >
            <ListItemText primary={section.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
