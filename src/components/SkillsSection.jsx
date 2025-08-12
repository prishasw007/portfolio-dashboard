import axios from "axios";
import React, { useState, useEffect, Suspense } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io";
import * as GiIcons from "react-icons/gi";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import DeleteIcon from "@mui/icons-material/Delete";
import toast, { Toaster } from "react-hot-toast";

const getIconComponent = (iconName) => {
  if (!iconName) return null;

  const prefix = iconName.slice(0, 2).toLowerCase();

  switch (prefix) {
    case "fa":
      return FaIcons[iconName];
    case "si":
      return SiIcons[iconName];
    case "md":
      return MdIcons[iconName];
    case "io":
      return IoIcons[iconName];
    case "gi":
      return GiIcons[iconName];
    case "ai":
      return AiIcons[iconName];
    case "bi":
      return BiIcons[iconName];
    default:
      return null;
  }
};

const IconLoader = ({ iconName }) => {
  const IconComponent = getIconComponent(iconName);

  if (!IconComponent) return null;

  return <IconComponent size={30} color="#555" />;
};

const SkillsSection = () => {
  const categories = [
    "Languages",
    "Frameworks and Technologies",
    "Developer Tools",
  ];

  const [skills, setSkills] = useState({
    "Languages": [],
    "Frameworks and Technologies": [],
    "Developer Tools": [],
  });

  const [newSkill, setNewSkill] = useState({
    category: "",
    name: "",
    iconName: "",
    logoFile: null,
    logoPreview: null,
  });

  // Fetch skills from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/Skills").then((res) => {
      const grouped = {
        Languages: [],
        "Frameworks and Technologies": [],
        "Developer Tools": [],
      };
      res.data.forEach((skill) => {
        grouped[skill.category]?.push(skill);
      });
      setSkills(grouped);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSkill((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNewSkill((prev) => ({
        ...prev,
        logoFile: file,
        logoPreview: previewUrl,
      }));
    }
  };

  const addSkill = async () => {
    const { category, name, iconName, logoFile } = newSkill;
    if (!category) {
      toast("Please select a category", {
        icon: "⚠️",
        style: { background: "#fff3cd", color: "#856404" },
      });
      return;
    }
    if (!name.trim()) {
      toast("Please select a category", {
        icon: "⚠️",
        style: { background: "#fff3cd", color: "#856404" },
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("name", name);
      formData.append("iconName", iconName);
      if (logoFile) {
        formData.append("icon", logoFile); // multer expects 'icon' field name for file upload
      }

      const res = await axios.post(
        "http://localhost:5000/api/Skills",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSkills((prev) => ({
        ...prev,
        [category]: [...prev[category], res.data],
      }));

      setNewSkill({
        category,
        name: "",
        iconName: "",
        logoFile: null,
        logoPreview: null,
      });

      toast.success("Skill added successfully!");
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill. Please try again.");
    }
  };

  const deleteSkill = async (category, id) => {
    await axios.delete(`http://localhost:5000/api/Skills/${id}`);
    setSkills((prev) => ({
      ...prev,
      [category]: prev[category].filter((skill) => skill._id !== id),
    }));
  };

  return (
    <Box>
      <Toaster position="top-right" />

      <Typography variant="h4" gutterBottom>
        Manage Skills
      </Typography>

      {/* Add Skill Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category"
            value={newSkill.category}
            onChange={handleInputChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <OutlinedInput
            placeholder="Skill Name"
            name="name"
            value={newSkill.name}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <OutlinedInput
            placeholder="React Icon Name (e.g. FaReact, SiJavascript)"
            name="iconName"
            value={newSkill.iconName}
            onChange={handleInputChange}
          />
          <Typography variant="caption" color="text.secondary">
            Enter react-icon component name (e.g. FaReact, SiJavascript)
          </Typography>
        </FormControl>

        <Button variant="contained" component="label" sx={{ mr: 2 }}>
          Upload Logo (optional)
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleLogoUpload}
          />
        </Button>

        {newSkill.logoPreview && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box
              component="img"
              src={newSkill.logoPreview}
              alt="Logo preview"
              sx={{
                width: 80,
                height: 80,
                objectFit: "contain",
                border: "1px solid #ccc",
              }}
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() =>
                setNewSkill((prev) => ({
                  ...prev,
                  logoFile: null,
                  logoPreview: null,
                }))
              }
            >
              Remove Logo
            </Button>
          </Box>
        )}

        <Button variant="contained" onClick={addSkill}>
          Add Skill
        </Button>
      </Paper>

      {/* Display Skills */}
      {categories.map((category) => (
        <Box key={category} sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {category}
          </Typography>
          {skills[category].length === 0 && (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No skills added yet.
            </Typography>
          )}

          <Grid container spacing={2}>
            {skills[category].map(({ _id, name, iconName, logoUrl }, index) => (
              <Grid item key={_id}>
                <Paper
                  sx={{
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 160,
                  }}
                  elevation={2}
                >
                  {logoUrl ? (
                    <Box
                      component="img"
                      src={logoUrl}
                      alt={`${name} logo`}
                      sx={{ width: 40, height: 40, objectFit: "contain" }}
                    />
                  ) : (
                    <Suspense
                      fallback={
                        <Box sx={{ width: 40, height: 40, bgcolor: "#ccc" }} />
                      }
                    >
                      <IconLoader iconName={iconName} />
                    </Suspense>
                  )}

                  <Typography sx={{ flexGrow: 1 }}>{name}</Typography>

                  <IconButton
                    aria-label="Delete skill"
                    color="error"
                    size="small"
                    onClick={() => deleteSkill(category, _id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default SkillsSection;
