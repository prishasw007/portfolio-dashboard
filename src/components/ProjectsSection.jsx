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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
    axios.get("http://localhost:5000/api/Projects").then((res) => {
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
      alert("Please enter both title and description.");
      return;
    }

    const res = await axios.post(
      "http://localhost:5000/api/Projects",
      newProject
    );
    setProjects((prev) => [...prev, res.data]);
    setNewProject({
      title: "",
      description: "",
      githubLink: "",
      websiteLink: "",
      languagesUsed: "",
    });
  };

  // Delete project (DELETE request)
  const deleteProject = async (id) => {
    await axios.delete(`http://localhost:5000/api/Projects/${id}`);
    setProjects((prev) => prev.filter((project) => project._id !== id));
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
        `http://localhost:5000/api/Projects/${editingId}`,
        editForm
      );

      setProjects((prev) =>
        prev.map((project) => (project._id === editingId ? res.data : project))
      );
      cancelEditing();
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project.");
    }
  };

  // Split languages into array for chips
  const getLanguagesArray = (languagesString) => {
    return languagesString
      .split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang.length > 0);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Projects
      </Typography>

      {/* Add New Project Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          label="Project Title"
          name="title"
          value={newProject.title}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
        />

        <TextField
          label="Short Description"
          name="description"
          value={newProject.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          label="GitHub Link"
          name="githubLink"
          value={newProject.githubLink}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          type="url"
          placeholder="https://github.com/yourusername/project"
        />

        <TextField
          label="Website Link (Optional)"
          name="websiteLink"
          value={newProject.websiteLink}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          type="url"
          placeholder="https://yourprojectwebsite.com"
        />

        <TextField
          label="Languages Used"
          name="languagesUsed"
          value={newProject.languagesUsed}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="JavaScript, React, Node.js"
        />

        <Button variant="contained" onClick={addProject}>
          Add Project
        </Button>
      </Paper>

      {projects.length === 0 && (
        <Typography color="text.secondary">No projects added yet.</Typography>
      )}

      <Grid container spacing={2}>
        {projects.map(
          (
            {
              _id,
              title,
              description,
              githubLink,
              websiteLink,
              languagesUsed, // languages used
            },
            index
          ) => (
            <Grid item xs={12} md={6} key={_id}>
              <Paper sx={{ p: 2, position: "relative" }} elevation={2}>
                <IconButton
                  aria-label="Delete project"
                  color="error"
                  size="small"
                  sx={{ position: "absolute", top: 4, right: 4 }}
                  onClick={() => deleteProject(_id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                {editingId === _id ? (
                  <>
                    <TextField
                      label="Title"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Description"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="GitHub Link"
                      name="githubLink"
                      value={editForm.githubLink}
                      onChange={handleEditChange}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Website Link"
                      name="websiteLink"
                      value={editForm.websiteLink}
                      onChange={handleEditChange}
                      fullWidth
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      label="Languages Used"
                      name="languagesUsed"
                      value={editForm.languagesUsed}
                      onChange={handleEditChange}
                      fullWidth
                      sx={{ mb: 1 }}
                      placeholder="JavaScript, React, Node.js"
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Button variant="contained" onClick={updateProject}>
                        Save
                      </Button>
                      <Button variant="outlined" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="h6" gutterBottom>
                      {title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {description}
                    </Typography>

                    {githubLink && (
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        GitHub:{" "}
                        <a href={githubLink} target="_blank" rel="noopener noreferrer">
                          {githubLink}
                        </a>
                      </Typography>
                    )}

                    {websiteLink && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Website:{" "}
                        <a href={websiteLink} target="_blank" rel="noopener noreferrer">
                          {websiteLink}
                        </a>
                      </Typography>
                    )}

                    {languagesUsed && (
                      <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {getLanguagesArray(languagesUsed).map((lang, i) => (
                          <Chip key={i} label={lang} size="small" />
                        ))}
                      </Box>
                    )}

                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => startEditing({ _id, title, description, githubLink, websiteLink, languagesUsed })}
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

export default ProjectsSection;
