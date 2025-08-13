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
import toast, { Toaster } from "react-hot-toast";

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
    logo: null, // URL string or File object
  });
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);
  const editFileInputRef = useRef();

  // Fetch experiences on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/Experiences")
      .then((res) => setExperiences(res.data))
      .catch((err) => console.error("Failed to fetch experiences", err));
  }, []);

  // --- Handlers for new experience inputs ---
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Delete logo before upload or after upload
  const removeLogo = async () => {
    if (
      newExperience._id &&
      newExperience.logo &&
      typeof newExperience.logo === "string"
    ) {
      await deleteLogoFromCloudinary(newExperience._id);
    }
    setNewExperience((prev) => ({ ...prev, logo: null }));
    setPreviewUrl(null);
    clearLogoInput();
  };

  // --- Add new experience ---
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
      if (logo) formData.append("logo", logo);

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
      toast.success("Experience added successfully!")
    } catch (error) {
      console.error("Failed to add experience", error);
      toast.error("Failed to add experience");
    }
  };

  // --- Delete experience ---
  const deleteExperience = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/Experiences/${id}`);
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      toast.success("Experience deleted!");
    } catch (error) {
      console.error("Failed to delete experience", error);
      toast.error("Failed to delete experience");
    }
  };

  // --- Delete logo from Cloudinary ---
  const deleteLogoFromCloudinary = async (id, isEdit = false) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/Experiences/${id}/logo`
      );
      toast.success("Logo deleted successfully!");

      if (isEdit) {
        setEditExperience((prev) => ({ ...prev, logo: null }));
        setEditPreviewUrl(null);
      } else {
        setExperiences((prev) =>
          prev.map((exp) => (exp._id === id ? { ...exp, logo: null } : exp))
        );
      }
    } catch (err) {
      console.error("Failed to delete logo", err);
      toast.error("Failed to delete logo");
    }
  };

  // --- Edit mode handlers ---
  const startEditing = (exp) => {
    setEditingId(exp._id);
    setEditExperience({
      companyName: exp.companyName || "",
      jobTitle: exp.jobTitle || "",
      duration: exp.duration || "",
      location: exp.location || "",
      description: exp.description || "",
      logo: exp.logo || null,
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
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const removeEditLogo = () => {
    if (
      editingId &&
      editExperience.logo &&
      typeof editExperience.logo === "string"
    ) {
      deleteLogoFromCloudinary(editingId, true);
    } else {
      setEditExperience((prev) => ({ ...prev, logo: null }));
      setEditPreviewUrl(null);
    }
    clearEditLogoInput();
  };

  // --- Update experience ---
  const updateExperience = async () => {
    const { companyName, jobTitle, duration, location, description, logo } =
      editExperience;

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

      if (logo && typeof logo !== "string") {
        formData.append("logo", logo);
      }

      const res = await axios.put(
        `http://localhost:5000/api/Experiences/${editingId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setExperiences((prev) =>
        prev.map((exp) => (exp._id === editingId ? res.data : exp))
      );
      cancelEditing();
    } catch (error) {
      console.error("Failed to update experience", error);
      toast.error("Failed to update experience");
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
    <Box sx={{ maxWidth: 900, mx: "auto", px: 3, py: 5 }}>
      <Toaster position="top-right" />

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "primary.main",
          mb: 5,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        Manage Experiences
      </Typography>

      {/* Add Experience Form */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mb: 6,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          bgcolor: "background.paper",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company Name"
              name="companyName"
              value={newExperience.companyName}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter company name"
              sx={{
                "& .MuiInputLabel-root": { fontWeight: 600 },
                "& .MuiInputBase-input": { fontSize: "1rem" },
              }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <Button
              variant="outlined"
              component="label"
              sx={{
                width: "100%",
                textTransform: "none",
                py: 1.75,
                borderColor: "primary.main",
                color: "primary.main",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "white",
                  borderColor: "primary.dark",
                },
              }}
            >
              Upload Company Logo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoChange}
                ref={fileInputRef}
              />
            </Button>
          </Grid>

          {previewUrl && (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "background.default",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                  maxWidth: 280,
                }}
              >
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Company Logo Preview"
                  sx={{
                    width: 110,
                    height: 110,
                    objectFit: "contain",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={removeLogo}
                  sx={{ textTransform: "none", minWidth: 100, fontWeight: 600 }}
                >
                  Remove Logo
                </Button>
              </Box>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              label="Job Title"
              name="jobTitle"
              value={newExperience.jobTitle}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Your job title"
              sx={{
                "& .MuiInputLabel-root": { fontWeight: 600 },
                "& .MuiInputBase-input": { fontSize: "1rem" },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Duration / Time"
              name="duration"
              value={newExperience.duration}
              onChange={handleChange}
              fullWidth
              placeholder="e.g., Jan 2022 - Dec 2023"
              sx={{
                "& .MuiInputLabel-root": { fontWeight: 600 },
                "& .MuiInputBase-input": { fontSize: "1rem" },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              name="location"
              value={newExperience.location}
              onChange={handleChange}
              fullWidth
              placeholder="City, Country"
              sx={{
                "& .MuiInputLabel-root": { fontWeight: 600 },
                "& .MuiInputBase-input": { fontSize: "1rem" },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Short Description"
              name="description"
              value={newExperience.description}
              onChange={handleChange}
              fullWidth
              multiline
              placeholder="Brief description"
              sx={{
                "& .MuiInputLabel-root": { fontWeight: 600 },
                "& .MuiInputBase-input": { fontSize: "1rem" },
              }}
            />
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              onClick={addExperience}
              disabled={
                !newExperience.companyName.trim() ||
                !newExperience.jobTitle.trim()
              }
              sx={{
                px: 6,
                py: 1.8,
                fontWeight: 700,
                fontSize: "1.1rem",
                borderRadius: 3,
                boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(25, 118, 210, 0.6)",
                },
              }}
            >
              Add Experience
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Experiences List */}
      {experiences.length === 0 ? (
        <Typography
          color="text.secondary"
          align="center"
          sx={{ mt: 10, fontStyle: "italic", fontSize: "1.1rem" }}
        >
          No experiences added yet.
        </Typography>
      ) : (
        <Grid container spacing={4}>
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
                <Paper
                  elevation={5}
                  sx={{
                    p: 3,
                    width: 900,
                    borderRadius: 3,
                    position: "relative",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 14px 40px rgba(0,0,0,0.15)",
                      transform: "translateY(-6px)",
                    },
                  }}
                >
                  <IconButton
                    aria-label="Delete experience"
                    color="error"
                    size="small"
                    sx={{ position: "absolute", top: 12, right: 12 }}
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
                        sx={{ mb: 2 }}
                        required
                        placeholder="Company name"
                        InputLabelProps={{ style: { fontWeight: 600 } }}
                        inputProps={{ style: { fontSize: "1rem" } }}
                      />

                      <Button
                        variant="outlined"
                        component="label"
                        sx={{ mb: 2, textTransform: "none", fontWeight: 600 }}
                      >
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
                            mb: 2,
                            borderRadius: 2,
                            bgcolor: "background.default",
                            boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
                            p: 1,
                            maxWidth: 280,
                          }}
                        >
                          <Box
                            component="img"
                            src={editPreviewUrl}
                            alt="Logo Preview"
                            sx={{
                              width: 110,
                              height: 110,
                              objectFit: "contain",
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={removeEditLogo}
                            sx={{ textTransform: "none", minWidth: 100 }}
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
                        sx={{ mb: 2 }}
                        required
                        placeholder="Job title"
                        InputLabelProps={{ style: { fontWeight: 600 } }}
                        inputProps={{ style: { fontSize: "1rem" } }}
                      />

                      <TextField
                        label="Duration / Time"
                        name="duration"
                        value={editExperience.duration}
                        onChange={handleEditChange}
                        fullWidth
                        sx={{ mb: 2 }}
                        placeholder="e.g., Jan 2022 - Dec 2023"
                        InputLabelProps={{ style: { fontWeight: 600 } }}
                        inputProps={{ style: { fontSize: "1rem" } }}
                      />

                      <TextField
                        label="Location"
                        name="location"
                        value={editExperience.location}
                        onChange={handleEditChange}
                        fullWidth
                        sx={{ mb: 2 }}
                        placeholder="City, Country"
                        InputLabelProps={{ style: { fontWeight: 600 } }}
                        inputProps={{ style: { fontSize: "1rem" } }}
                      />

                      <TextField
                        label="Short Description"
                        name="description"
                        value={editExperience.description}
                        onChange={handleEditChange}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                        placeholder="Brief description of your role or achievements"
                        InputLabelProps={{ style: { fontWeight: 600 } }}
                        inputProps={{ style: { fontSize: "1rem" } }}
                      />

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          variant="contained"
                          onClick={updateExperience}
                          sx={{
                            px: 4,
                            py: 1.5,
                            fontWeight: 700,
                            fontSize: "1rem",
                            borderRadius: 2,
                            boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 6px 20px rgba(25, 118, 210, 0.6)",
                            },
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={cancelEditing}
                          sx={{
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: "1rem",
                            borderRadius: 2,
                            textTransform: "none",
                          }}
                        >
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
                            borderRadius: 2,
                            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                          }}
                        />
                      )}

                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "text.primary" }}
                      >
                        {companyName}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "text.secondary" }}
                      >
                        {jobTitle}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {duration} {duration && location ? " | " : ""}{" "}
                        {location}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.5,
                          whiteSpace: "pre-line",
                          color: "text.primary",
                        }}
                      >
                        {description}
                      </Typography>

                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          mt: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          borderColor: "primary.main",
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                            borderColor: "primary.dark",
                          },
                        }}
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
      )}
    </Box>
  );
};

export default ExperienceSection;
