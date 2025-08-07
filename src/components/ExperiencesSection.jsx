import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);

  // New experience form state
  const [newExperience, setNewExperience] = useState({
    companyName: "",
    jobTitle: "",
    duration: "",
    location: "",
    description: "",
    logo: null, // store image as Data URL
  });

  const fileInputRef = useRef();

  // fetching from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/Experiences").then((res) => {
      setExperiences(res.data);
    });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({ ...prev, [name]: value }));
  };

  // Handle logo upload and convert to base64 string for preview/storage
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewExperience((prev) => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Clear logo input (to allow re-upload same file if needed)
  const clearLogoInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove uploaded logo from form
  const removeLogo = () => {
    setNewExperience((prev) => ({ ...prev, logo: null }));
    clearLogoInput();
  };

  //Add experience from backend
  const addExperience = async () => {
    const { companyName, jobTitle, duration, location, description, logo } =
      newExperience;
    if (!companyName.trim() || !jobTitle.trim()) {
      return alert("Company name and job title are required.");
    }

    const res = await axios.post("http://localhost:5000/api/Experiences", {
      companyName,
      jobTitle,
      duration,
      location,
      description,
      logo,
    });

    setExperiences((prev) => [...prev, res.data]);

    setNewExperience({
      companyName: "",
      jobTitle: "",
      duration: "",
      location: "",
      description: "",
      logo: null,
    });

    clearLogoInput();
  };

  // Delete experience from backend and update state by filtering with _id
  const deleteExperience = async (id) => {
    await axios.delete(`http://localhost:5000/api/Experiences/${id}`);
    setExperiences((prev) => prev.filter((exp) => exp._id !== id));
  };

  // Update experience in backend and update state by mapping over _id
  const updateExperience = async (id, updatedFields) => {
    const res = await axios.put(
      `http://localhost:5000/api/Experiences/${id}`,
      updatedFields
    );
    setExperiences((prev) =>
      prev.map((exp) => (exp._id === id ? res.data : exp))
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Experiences
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          label="Company Name"
          name="companyName"
          value={newExperience.companyName}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
        />

        <Button variant="outlined" component="label" sx={{ mb: 2 }}>
          Upload Company Logo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleLogoChange}
            ref={fileInputRef}
          />
        </Button>

        {newExperience.logo && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Box
              component="img"
              src={newExperience.logo}
              alt="Company Logo"
              sx={{
                width: 100,
                height: 100,
                objectFit: "contain",
                borderRadius: 1,
              }}
            />
            <Button variant="outlined" color="error" onClick={removeLogo}>
              Remove Logo
            </Button>
          </Box>
        )}

        <TextField
          label="Job Title"
          name="jobTitle"
          value={newExperience.jobTitle}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
        />

        <TextField
          label="Duration / Time"
          name="duration"
          value={newExperience.duration}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="e.g., Jan 2022 - Dec 2023"
        />

        <TextField
          label="Location"
          name="location"
          value={newExperience.location}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="City, Country"
        />

        <TextField
          label="Short Description"
          name="description"
          value={newExperience.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" onClick={addExperience}>
          Add Experience
        </Button>
      </Paper>

      {experiences.length === 0 && (
        <Typography color="text.secondary">
          No experiences added yet.
        </Typography>
      )}

      <Grid container spacing={2}>
        {experiences.map(
          (
            { _id,companyName, jobTitle, duration, location, description, logo },
            index
          ) => (
            <Grid item xs={12} md={6} key={_id}>
              <Paper sx={{ p: 2, position: "relative" }} elevation={2}>
                <IconButton
                  aria-label="Delete experience"
                  color="error"
                  size="small"
                  sx={{ position: "absolute", top: 4, right: 4 }}
                  onClick={() => deleteExperience(_id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                {logo && (
                  <Box
                    component="img"
                    src={logo}
                    alt={`${companyName} logo`}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "contain",
                      mb: 1,
                      borderRadius: 1,
                    }}
                  />
                )}

                <Typography variant="h6">{companyName}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {jobTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {duration} | {location}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {description}
                </Typography>
              </Paper>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default ExperienceSection;
