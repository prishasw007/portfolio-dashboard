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
    logo: null, // store File object here
  });

  const [previewUrl, setPreviewUrl] = useState(null);

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

  // Handle logo upload and set file + preview URL
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewExperience((prev) => ({ ...prev, logo: file }));

    // Create preview URL
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Clear logo input (to allow re-upload same file if needed)
  const clearLogoInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove uploaded logo from form & preview
  const removeLogo = () => {
    setNewExperience((prev) => ({ ...prev, logo: null }));
    setPreviewUrl(null);
    clearLogoInput();
  };

  // Add experience - send formData with file
  const addExperience = async () => {
    const { companyName, jobTitle, duration, location, description, logo } =
      newExperience;
    if (!companyName.trim() || !jobTitle.trim()) {
      return alert("Company name and job title are required.");
    }

    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("jobTitle", jobTitle);
      formData.append("duration", duration);
      formData.append("location", location);
      formData.append("description", description);

      if (logo) {
        formData.append("logo", logo);
      }

      const res = await axios.post("http://localhost:5000/api/Experiences", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
      setPreviewUrl(null);
      clearLogoInput();
    } catch (error) {
      console.error("Failed to add experience", error);
      alert("Failed to add experience");
    }
  };

  // Delete experience from backend and update state
  const deleteExperience = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/Experiences/${id}`);
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error("Failed to delete experience", error);
      alert("Failed to delete experience");
    }
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

        {previewUrl && (
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
              src={previewUrl}
              alt="Company Logo Preview"
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
        <Typography color="text.secondary">No experiences added yet.</Typography>
      )}

      <Grid container spacing={2}>
        {experiences.map(
          (
            {
              _id,
              companyName,
              jobTitle,
              duration,
              location,
              description,
              logo,
            },
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
