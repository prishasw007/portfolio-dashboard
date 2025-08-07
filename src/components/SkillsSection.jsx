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

const importIcon = async (iconName) => {
  if (!iconName || iconName.length < 2) return null;
  const prefix = iconName.slice(0, 2).toLowerCase();

  let pkg;
  switch (prefix) {
    case "fa":
      pkg = await import("react-icons/fa");
      break;
    case "si":
      pkg = await import("react-icons/si");
      break;
    case "md":
      pkg = await import("react-icons/md");
      break;
    case "io":
      pkg = await import("react-icons/io");
      break;
    case "gi":
      pkg = await import("react-icons/gi");
      break;
    case "ai":
      pkg = await import("react-icons/ai");
      break;
    default:
      return null;
  }
  return pkg[iconName] || null;
};

const IconLoader = ({ iconName }) => {
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    importIcon(iconName).then((component) => {
      if (isMounted) setIconComponent(() => component);
    });
    return () => {
      isMounted = false;
    };
  }, [iconName]);

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
    const { category, name, iconName, logoPreview } = newSkill;
    if (!name.trim()) return alert("Please enter a skill name");

    const res = await axios.post("http://localhost:5000/api/Skills", {
      category,
      name,
      iconName,
      logoUrl: logoPreview || "",
    });

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
