import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import toast, { Toaster } from "react-hot-toast";
const API_BASE = import.meta.env.VITE_API_URL;

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);

  // New project form state
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    githubLink: "",
    websiteLink: "",
    languagesUsed: "",
  });

  // Edit mode state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    githubLink: "",
    websiteLink: "",
    languagesUsed: "",
  });

  // Fetch projects from backend on mount
  useEffect(() => {
    axios.get(`${API_BASE}/api/Projects`).then((res) => {
      setProjects(res.data);
    });
  }, []);

  // Handle form input changes for new project
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  // Add project (POST request)
  const addProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      toast("Please enter both title and description.", {
        icon: "⚠️",
        style: { background: "#fff3cd", color: "#856404" },
      });
      // alert("Please enter both title and description.");
      return;
    }

    const res = await axios.post(`${API_BASE}/api/Projects`, newProject);
    setProjects((prev) => [...prev, res.data]);
    setNewProject({
      title: "",
      description: "",
      githubLink: "",
      websiteLink: "",
      languagesUsed: "",
    });
    toast.success("Project added successfully!");
  };

  // Delete project (DELETE request)
  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/Projects/${id}`);
      setProjects((prev) => prev.filter((project) => project._id !== id));
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Failed to delete experience", error);
      toast.error("Failed to delete experience");
    }
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Start editing a project: populate edit form
  const startEditing = (project) => {
    setEditingId(project._id);
    setEditForm({
      title: project.title || "",
      description: project.description || "",
      githubLink: project.githubLink || "",
      websiteLink: project.websiteLink || "",
      languagesUsed: project.languagesUsed || "",
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
      githubLink: "",
      websiteLink: "",
      languagesUsed: "",
    });
  };

  // Update project (PUT request)
  const updateProject = async () => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/Projects/${editingId}`,
        editForm
      );

      setProjects((prev) =>
        prev.map((project) => (project._id === editingId ? res.data : project))
      );
      cancelEditing();
      toast.success("Project updated successfully!");
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project.");
      // alert("Failed to update project.");
    }
  };

  // Split languages into array for chips
  const getLanguagesArray = (languagesString) => {
    return languagesString
      .split("|")
      .map((lang) => lang.trim())
      .filter((lang) => lang.length > 0);
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
        Manage Projects
      </Typography>

      {/* Add New Project Form */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mb: 6,
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          bgcolor: "background.paper",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Project Title"
              name="title"
              value={newProject.title}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter project title"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Short Description"
              name="description"
              value={newProject.description}
              onChange={handleChange}
              fullWidth
              multiline
              required
              placeholder="Describe here"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="GitHub Link"
              name="githubLink"
              value={newProject.githubLink}
              onChange={handleChange}
              fullWidth
              type="url"
              placeholder="https://github.com/yourusername/project"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Website Link (Optional)"
              name="websiteLink"
              value={newProject.websiteLink}
              onChange={handleChange}
              fullWidth
              type="url"
              placeholder="https://yourprojectwebsite.com"
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Languages Used"
              name="languagesUsed"
              value={newProject.languagesUsed}
              onChange={handleChange}
              fullWidth
              placeholder="JavaScript, React, Node.js"
              sx={{ mb: 3 }}
            />
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              onClick={addProject}
              disabled={
                !newProject.title.trim() || !newProject.description.trim()
              }
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 4px 14px rgb(0 123 255 / 0.4)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgb(0 123 255 / 0.6)",
                },
              }}
            >
              Add Project
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Projects List */}
      {projects.length === 0 ? (
        <Typography
          color="text.secondary"
          align="center"
          sx={{ mt: 10, fontStyle: "italic", fontSize: 18 }}
        >
          No projects added yet.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {projects.map(
            ({
              _id,
              title,
              description,
              githubLink,
              websiteLink,
              languagesUsed,
            }) => (
              <Grid item xs={12} md={6} key={_id}>
                <Paper
                  elevation={5}
                  sx={{
                    width: 900,
                    p: 3,
                    borderRadius: 3,
                    position: "relative",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <IconButton
                    aria-label="Delete project"
                    color="error"
                    size="small"
                    sx={{ position: "absolute", top: 12, right: 12 }}
                    onClick={() => deleteProject(_id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>

                  {editingId === _id ? (
                    <>
                      <Stack spacing={2}>
                        <TextField
                          label="Title"
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
                          fullWidth
                          required
                        />
                        <TextField
                          label="Description"
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          fullWidth
                          multiline
                          rows={3}
                          required
                        />
                        <TextField
                          label="GitHub Link"
                          name="githubLink"
                          value={editForm.githubLink}
                          onChange={handleEditChange}
                          fullWidth
                          type="url"
                        />
                        <TextField
                          label="Website Link"
                          name="websiteLink"
                          value={editForm.websiteLink}
                          onChange={handleEditChange}
                          fullWidth
                          type="url"
                        />
                        <TextField
                          label="Languages Used"
                          name="languagesUsed"
                          value={editForm.languagesUsed}
                          onChange={handleEditChange}
                          fullWidth
                          placeholder="JavaScript, React, Node.js"
                        />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 1,
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={updateProject}
                            sx={{ px: 4, fontWeight: 600 }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={cancelEditing}
                            sx={{ px: 4 }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Stack>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 700, color: "text.primary" }}
                      >
                        {title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mb: 1,
                          color: "text.secondary",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {description}
                      </Typography>

                      {githubLink && (
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 0.5,
                            color: "primary.main",
                            wordBreak: "break-word",
                          }}
                        >
                          GitHub:{" "}
                          <a
                            href={githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "inherit",
                              textDecoration: "underline",
                            }}
                          >
                            {githubLink}
                          </a>
                        </Typography>
                      )}

                      {websiteLink && (
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            color: "primary.main",
                            wordBreak: "break-word",
                          }}
                        >
                          Website:{" "}
                          <a
                            href={websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "inherit",
                              textDecoration: "underline",
                            }}
                          >
                            {websiteLink}
                          </a>
                        </Typography>
                      )}

                      {languagesUsed && (
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          {getLanguagesArray(languagesUsed).map((lang, i) => (
                            <Chip
                              key={i}
                              label={lang}
                              size="small"
                              color="primary"
                              sx={{ fontWeight: 600 }}
                            />
                          ))}
                        </Box>
                      )}

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
                            borderColor: "primary.dark",
                            backgroundColor: "primary.light",
                          },
                        }}
                        onClick={() =>
                          startEditing({
                            _id,
                            title,
                            description,
                            githubLink,
                            websiteLink,
                            languagesUsed,
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

export default ProjectsSection;
