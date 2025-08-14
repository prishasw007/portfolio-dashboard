import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL;

const AboutMeSection = () => {
  const [aboutText, setAboutText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aboutId, setAboutId] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/AboutMe`);
        if (res.data.length > 0) {
          const about = res.data[0];
          setAboutId(about._id);
          setAboutText(about.text);
          setPreview(about.logo || null);
        }
      } catch (error) {
        toast.error("Failed to load About Me");
        console.error(error);
      }
    };
    fetchAbout();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhoto(null);
      setPreview(null);
      toast("Please select a valid image file", { icon: "⚠️" });
    }
  };

  const handleDeletePhoto = async () => {
    if (!aboutId) {
      setPhoto(null);
      setPreview(null);
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/api/AboutMe/${aboutId}/photo`);
      setPhoto(null);
      setPreview(null);
      toast.success("Profile photo deleted");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting profile photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!aboutText.trim()) {
      toast.error("Please write something about yourself.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", aboutText);
      if (photo) formData.append("photo", photo);

      let res;
      if (aboutId) {
        res = await axios.put(
          `${API_BASE}/api/AboutMe/${aboutId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await axios.post(`${API_BASE}/api/AboutMe`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAboutId(res.data._id);
      }

      setAboutText(res.data.text);

      // Update preview from backend logo URL
      if (res.data.logo) setPreview(res.data.logo);

      setPhoto(null);
      toast.success("About Me info saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error saving About Me info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 700, mx: "auto", p: 4, borderRadius: 2, border: "1px solid #ddd" }}>
      <Toaster position="top-right" />
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: "primary.main", mb: 4, textAlign: "center" }}>
        About Me
      </Typography>

      <TextField
        label="Write something about yourself..."
        multiline
        rows={6}
        fullWidth
        value={aboutText}
        onChange={(e) => setAboutText(e.target.value)}
        sx={{ mb: 5, "& .MuiInputBase-root": { bgcolor: "#fafafa" } }}
        placeholder="Tell us about your background, interests, or anything you'd like to share."
      />

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Button variant="contained" component="label" disabled={loading} sx={{ textTransform: "none", fontWeight: 600 }}>
          Upload Profile Photo
          {/* Important: add name="photo" for Multer */}
          <input type="file" name="photo" accept="image/*" hidden onChange={handlePhotoChange} />
        </Button>

        {preview && (
          <>
            <Avatar
              src={preview}
              alt="Profile Preview"
              sx={{ width: 80, height: 80, borderRadius: 2, border: "2px solid #1976d2", bgcolor: "#e3f2fd" }}
              variant="rounded"
            />
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeletePhoto}
              disabled={loading}
              sx={{ textTransform: "none", fontWeight: 600, height: 40, borderColor: "#d32f2f", color: "#d32f2f",
                    ":hover": { borderColor: "#9a0007", backgroundColor: "#fcebea", color: "#9a0007" } }}
            >
              Delete
            </Button>
          </>
        )}
      </Stack>

      <Box sx={{ textAlign: "center" }}>
        <Button variant="contained" onClick={handleSave} disabled={loading} sx={{ minWidth: 140, fontWeight: 700, fontSize: 16 }}>
          {loading ? (
            <>Saving&nbsp;<CircularProgress size={20} color="inherit" sx={{ ml: 1 }} /></>
          ) : (
            "Save Changes"
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default AboutMeSection;
