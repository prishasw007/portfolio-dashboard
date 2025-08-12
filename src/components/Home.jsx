import React from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";

const Home = () => {
  return (
    <Paper elevation={3} sx={{ p: 4, bgcolor: "#fff", borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Welcome to your Portfolio Dashboard 🎉
      </Typography>
{/* 
      <Typography variant="body1" sx={{ mb: 3 }}>
        Start by adding your portfolio link or jump into editing your skills, projects, and more!
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField fullWidth label="Your Portfolio Link" placeholder="https://yourname.dev" />
        <Button variant="contained" color="primary">
          Save Link
        </Button>
      </Box> */}

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        What you can do from here:
      </Typography>
      <ul style={{ paddingLeft: "1.5rem", lineHeight: 2 }}>
        <li>Add your skills</li>
        <li>Showcase your projects</li>
        <li>Write your About Me</li>
        <li>View messages from your contact form</li>
      </ul>
    </Paper>
  );
};

export default Home;
