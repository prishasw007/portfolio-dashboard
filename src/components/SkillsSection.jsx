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
import DeleteIcon from "@mui/icons-material/Delete";
import toast, { Toaster } from "react-hot-toast";

// Import all react-icons
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io";
import * as GiIcons from "react-icons/gi";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";

// Helper to get the icon component dynamically
const getIconComponent = (iconName) => {
  if (!iconName) return null;
  const prefix = iconName.slice(0, 2).toLowerCase();
  switch (prefix) {
    case "fa": return FaIcons[iconName];
    case "si": return SiIcons[iconName];
    case "md": return MdIcons[iconName];
    case "io": return IoIcons[iconName];
    case "gi": return GiIcons[iconName];
    case "ai": return AiIcons[iconName];
    case "bi": return BiIcons[iconName];
    default: return null;
  }
};

const IconLoader = ({ iconName }) => {
  const IconComponent = getIconComponent(iconName);
  if (!IconComponent) return null;
  return <IconComponent size={30} color="#555" />;
};

const SkillsSection = () => {
  const categories = ["Languages", "Frameworks and Technologies", "Developer Tools"];

  const [skills, setSkills] = useState({
    Languages: [],
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

  // Fetch skills
  useEffect(() => {
    axios.get("http://localhost:5000/api/Skills")
      .then((res) => {
        const grouped = {
          Languages: [],
          "Frameworks and Technologies": [],
          "Developer Tools": [],
        };
        res.data.forEach((skill) => {
          grouped[skill.category]?.push(skill);
        });
        setSkills(grouped);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSkill((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSkill((prev) => ({
        ...prev,
        logoFile: file,
        logoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const addSkill = async () => {
    const { category, name, iconName, logoFile } = newSkill;
    if (!category || !name.trim()) {
      toast("Please provide both category and skill name.", { icon: "⚠️" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("name", name);
      formData.append("iconName", iconName);
      if (logoFile) formData.append("logo", logoFile); // must match backend multer field

      const res = await axios.post("http://localhost:5000/api/Skills", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSkills((prev) => ({
        ...prev,
        [category]: [...prev[category], res.data],
      }));

      setNewSkill({ category, name: "", iconName: "", logoFile: null, logoPreview: null });
      toast.success("Skill added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add skill");
    }
  };

  const deleteSkill = async (category, id) => {
    try {
      await axios.delete(`http://localhost:5000/api/Skills/${id}`);
      setSkills((prev) => ({
        ...prev,
        [category]: prev[category].filter((skill) => skill._id !== id),
      }));
      toast.success("Skill deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete skill");
    }
  };

  const deleteSkillLogo = async (category, skill) => {
    if (!skill.publicId) return;
    try {
      await axios.delete(`http://localhost:5000/api/Skills/${skill._id}/logo`);
      setSkills((prev) => ({
        ...prev,
        [category]: prev[category].map((s) =>
          s._id === skill._id ? { ...s, logoUrl: null, publicId: null } : s
        ),
      }));
      toast.success("Logo deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete logo");
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
      <Toaster position="top-right" />

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, textAlign: "center", mb: 4 }}>
        Manage Skills
      </Typography>

      {/* Add Skill Form */}
      <Paper sx={{ p: 4, mb: 6, borderRadius: 3, boxShadow: 2 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={newSkill.category}
            onChange={handleInputChange}
            label="Category"
          >
            {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
        </FormControl>

        <OutlinedInput
          fullWidth
          placeholder="Skill Name"
          name="name"
          value={newSkill.name}
          onChange={handleInputChange}
          sx={{ mb: 3, px: 2, py: 1.5 }}
        />

        <OutlinedInput
          fullWidth
          placeholder="React Icon Name (e.g. FaReact)"
          name="iconName"
          value={newSkill.iconName}
          onChange={handleInputChange}
          sx={{ mb: 3, px: 2, py: 1.5 }}
        />

        <Button variant="contained" component="label" sx={{ mb: 3 }}>
          Upload Logo (optional)
          <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
        </Button>

        {newSkill.logoPreview && (
          <Box sx={{ mb: 3 }}>
            <img src={newSkill.logoPreview} alt="preview" width={80} height={80} />
          </Box>
        )}

        <Button variant="contained" fullWidth onClick={addSkill}>Add Skill</Button>
      </Paper>

      {/* Display Skills */}
      {categories.map((category) => (
        <Box key={category} sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>{category}</Typography>
          {skills[category].length === 0 ? (
            <Typography color="text.secondary">No skills added yet.</Typography>
          ) : (
            <Grid container spacing={2}>
              {skills[category].map((skill) => (
                <Grid item key={skill._id}>
                  <Paper sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    {skill.logoUrl ? (
                      <Box component="img" src={skill.logoUrl} alt={skill.name} width={40} height={40} />
                    ) : (
                      <Suspense fallback={<Box sx={{ width: 40, height: 40, bgcolor: "grey.300" }} />}>
                        <IconLoader iconName={skill.iconName} />
                      </Suspense>
                    )}

                    <Typography sx={{ flexGrow: 1 }}>{skill.name}</Typography>


                    <IconButton color="error" size="small" onClick={() => deleteSkill(category, skill._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default SkillsSection;
