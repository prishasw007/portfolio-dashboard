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
import toast, {Toaster} from "react-hot-toast";

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);

  // New experience form state
  const [newExperience, setNewExperience] = useState({
    companyName: "",
    jobTitle: "",
    duration: "",
    location: "",
    description: "",
    logo: null, // File object for new upload
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();

  // Edit mode state
  const [editingId, setEditingId] = useState(null);
  const [editExperience, setEditExperience] = useState({
    companyName: "",
    jobTitle: "",
    duration: "",
    location: "",
    description: "",
    logo: null, // This can be a URL string or a File object while editing
  });
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);
  const editFileInputRef = useRef();

  // Fetch experiences on mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/Experiences").then((res) => {
      setExperiences(res.data);
    });
  }, []);

  // Handlers for new experience inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewExperience((prev) => ({ ...prev, logo: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearLogoInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeLogo = () => {
    setNewExperience((prev) => ({ ...prev, logo: null }));
    setPreviewUrl(null);
    clearLogoInput();
  };

  // Add new experience
  const addExperience = async () => {
    const { companyName, jobTitle, duration, location, description, logo } =
      newExperience;
    if (!companyName.trim() || !jobTitle.trim()) {
      toast("Company name and job title are required.", {
        icon: "⚠️",
        style: { background: "#fff3cd", color: "#856404" },
      });
      return;
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

      const res = await axios.post(
        "http://localhost:5000/api/Experiences",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

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
      toast.error("Failed to add experience");
      // alert("Failed to add experience");
    }
  };

  // Delete experience
  const deleteExperience = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/Experiences/${id}`);
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error("Failed to delete experience", error);
      toast.error("Failed to delete experience");
      // alert("Failed to delete experience");
    }
  };

  // Edit mode handlers
  const startEditing = (exp) => {
    setEditingId(exp._id);
    setEditExperience({
      companyName: exp.companyName || "",
      jobTitle: exp.jobTitle || "",
      duration: exp.duration || "",
      location: exp.location || "",
      description: exp.description || "",
      logo: exp.logo || null, // string URL or null
    });
    setEditPreviewUrl(exp.logo || null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditExperience((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditExperience((prev) => ({ ...prev, logo: file }));
    setEditPreviewUrl(URL.createObjectURL(file));
  };

  const clearEditLogoInput = () => {
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const removeEditLogo = () => {
    setEditExperience((prev) => ({ ...prev, logo: null }));
    setEditPreviewUrl(null);
    clearEditLogoInput();
  };

  // Update experience
  const updateExperience = async () => {
    const { companyName, jobTitle, duration, location, description, logo } =
      editExperience;

    if (!companyName.trim() || !jobTitle.trim()) {
      toast("Company name and job title are required.", {
        icon: "⚠️",
        style: { background: "#fff3cd", color: "#856404" },
      });
      return;
      // return alert("Company name and job title are required.");
    }

    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("jobTitle", jobTitle);
      formData.append("duration", duration);
      formData.append("location", location);
      formData.append("description", description);

      // Append logo only if it's a File (new upload), skip if it's URL string (existing)
      if (logo && typeof logo !== "string") {
        formData.append("logo", logo);
      }

      const res = await axios.put(
        `http://localhost:5000/api/Experiences/${editingId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setExperiences((prev) =>
        prev.map((exp) => (exp._id === editingId ? res.data : exp))
      );
      cancelEditing();
    } catch (error) {
      console.error("Failed to update experience", error);
      toast.error("Failed to update experience");
      // alert("Failed to update experience");
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditExperience({
      companyName: "",
      jobTitle: "",
      duration: "",
      location: "",
      description: "",
      logo: null,
    });
    setEditPreviewUrl(null);
    clearEditLogoInput();
  };

  return (
    <Box>
      <Toaster position="top-right" />
      <Typography variant="h4" gutterBottom>
        Manage Experiences
      </Typography>

      {/* Add Experience Form */}
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

      {/* Experiences List */}
      {experiences.length === 0 && (
        <Typography color="text.secondary">
          No experiences added yet.
        </Typography>
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

                {editingId === _id ? (
                  <>
                    <TextField
                      label="Company Name"
                      name="companyName"
                      value={editExperience.companyName}
                      onChange={handleEditChange}
                      fullWidth
                      sx={{ mb: 1 }}
                      required
                    />

                    <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                      {editPreviewUrl ? "Change Logo" : "Upload Company Logo"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleEditLogoChange}
                        ref={editFileInputRef}
                      />
                    </Button>

                    {editPreviewUrl && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Box
                          component="img"
                          src={editPreviewUrl}
                          alt="Logo Preview"
                          sx={{
                            width: 100,
                            height: 100,
                            objectFit: "contain",
                            borderRadius: 1,
                          }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={removeEditLogo}
                        >
                          Remove Logo
                        </Button>
                      </Box>
                    )}

                    <TextField
                      label="Job Title"
                      name="jobTitle"
                      value={editExperience.jobTitle}
                      onChange={handleEditChange}
                      fullWidth
                      sx={{ mb: 1 }}
                      required
                    />

                    <TextField
                      label="Duration / Time"
                      name="duration"
                      value={editExperience.duration}
                      onChange={handleEditChange}
                      fullWidth
                      sx={{ mb: 1 }}
                      placeholder="e.g., Jan 2022 - Dec 2023"
                    />

                    <TextField
                      label="Location"
                      name="location"
                      value={editExperience.location}
                      onChange={handleEditChange}
                      fullWidth
                      sx={{ mb: 1 }}
                      placeholder="City, Country"
                    />

                    <TextField
                      label="Short Description"
                      name="description"
                      value={editExperience.description}
                      onChange={handleEditChange}
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mb: 1 }}
                    />

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button variant="contained" onClick={updateExperience}>
                        Save
                      </Button>
                      <Button variant="outlined" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
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

                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() =>
                        startEditing({
                          _id,
                          companyName,
                          jobTitle,
                          duration,
                          location,
                          description,
                          logo,
                        })
                      }
                    >
                      Edit
                    </Button>
                  </>
                )}
              </Paper>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default ExperienceSection;
