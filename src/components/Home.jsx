import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
        bgcolor: "#f0f4f8",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 4, md: 6 },
          maxWidth: 800,
          borderRadius: 4,
          bgcolor: "background.paper",
          boxShadow:
            "0 12px 24px rgba(0,0,0,0.12), 0 0 6px rgba(0,0,0,0.06)",
          textAlign: "center",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow:
              "0 16px 32px rgba(0,0,0,0.16), 0 0 10px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 3,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          Welcome to Your Portfolio Dashboard
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 5,
            fontSize: "1.15rem",
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          Start managing your skills, projects, About Me section, and keep track
          of messages from your visitors — all in one place.
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: "text.primary",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          What you can do from here:
        </Typography>

        <List
          sx={{
            maxWidth: 450,
            mx: "auto",
            bgcolor: "#f9fafb",
            borderRadius: 3,
            p: 3,
            boxShadow: "inset 0 0 12px #e5e7eb",
          }}
        >
          {[
            "Add your skills",
            "Showcase your projects",
            "Write your About Me",
            "View messages from your contact form",
          ].map((item) => (
            <ListItem
              key={item}
              sx={{
                py: 1.5,
                borderRadius: 2,
                cursor: "default",
                transition: "background-color 0.25s ease",
                "&:hover": { bgcolor: "primary.light", color: "primary.contrastText" },
                "&:hover .MuiListItemIcon-root": { color: "primary.contrastText" },
              }}
            >
              <ListItemIcon sx={{ color: "primary.main", minWidth: 36 }}>
                <CheckCircleIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText
                primary={item}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: 600,
                    fontSize: "1.05rem",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Home;
