import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";

const AboutMeSection = () => {
  const [aboutText, setAboutText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aboutId, setAboutId] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/AboutMe");
        if (res.data.length > 0) {
          const about = res.data[0];
          setAboutId(about._id);
          setAboutText(about.text);
          setPreview(about.logo || null);
        }
      } catch (error) {
        toast.error("Failed to load AboutMe");
        console.error("Failed to load AboutMe:", error);
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
      toast("Please select a valid image file",{
        icon: "⚠️",
        style: { background: "#fff3cd", color: "#856404" },
      });
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
      const formData = new FormData();
      formData.append("text", aboutText);
      formData.append("removePhoto", "true");

      const res = await axios.put(
        `http://localhost:5000/api/AboutMe/${aboutId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setPreview(null);
      setPhoto(null);
      setAboutText(res.data.text);
    } catch (error) {
      console.error("Failed to delete photo:", error);
      toast.error("Error deleting profile photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", aboutText);
      if (photo) formData.append("photo", photo);

      let res;
      if (aboutId) {
        res = await axios.put(
          `http://localhost:5000/api/AboutMe/${aboutId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await axios.post("http://localhost:5000/api/AboutMe", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAboutId(res.data._id);
      }

      setAboutText(res.data.text);
      setPreview(res.data.logo || null); // backend sends 'logo'
      setPhoto(null);
      toast.success("About Me info saved successfully!");
      // alert("About Me info saved successfully!");
    } catch (error) {
      console.error("Error saving About Me info:", error);
      toast.error("Error saving About Me info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, p: 3 }}>
      <Toaster position ="top-right"/>
      <Typography variant="h4" gutterBottom>
        About Me
      </Typography>

      <TextField
        label="Write something about yourself..."
        multiline
        rows={6}
        fullWidth
        value={aboutText}
        onChange={(e) => setAboutText(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Button variant="contained" component="label" disabled={loading}>
          Upload Profile Photo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoChange}
          />
        </Button>

        {preview && (
          <>
            <Avatar
              src={preview}
              alt="Profile Preview"
              sx={{ width: 80, height: 80 }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeletePhoto}
              disabled={loading}
            >
              Delete Photo
            </Button>
          </>
        )}
      </Stack>

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={loading}
        sx={{ minWidth: 120 }}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </Box>
  );
};

export default AboutMeSection;
