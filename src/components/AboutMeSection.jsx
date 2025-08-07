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

const AboutMeSection = () => {
  const [aboutText, setAboutText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aboutId, setAboutId] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      const res = await axios.get("http://localhost:5000/api/AboutMe");
      if (res.data.length > 0) {
        const about = res.data[0];
        setAboutId(about._id);
        setAboutText(about.text);
        setPreview(about.logo || null);
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
      alert("Please select a valid image file.");
    }
  };

  const handleText = async () => {
    if (!aboutId) {
      // No saved about data yet, just clear locally
      setAboutText("");
      return;
    }

    try {
      setLoading(true);
      // Send PUT request to update only the logo to null
      const res = await axios.put(
        `http://localhost:5000/api/AboutMe/${aboutId}`,
        {
          logo: preview,
          text: "",
        }
      );

      // Update local state accordingly
      setAboutText(res.data.text || "");
      alert("Text cleared successfully.");
    } catch (error) {
      console.error("Failed to delete text:", error);
      alert("Error deleting text, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!aboutId) {
      // No saved about data yet, just clear locally
      setPhoto(null);
      setPreview(null);
      return;
    }

    try {
      setLoading(true);
      // Send PUT request to update only the logo to null
      const res = await axios.put(
        `http://localhost:5000/api/AboutMe/${aboutId}`,
        {
          logo: null, // Remove the logo
          text: aboutText, // Keep existing text unchanged
        }
      );

      // Update local state accordingly
      setPreview(null);
      setPhoto(null);
      setAboutText(res.data.text); // refresh text from backend response (optional)
    } catch (error) {
      console.error("Failed to delete photo:", error);
      alert("Error deleting profile photo, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Send JSON with aboutText and base64 photo string (or null)
      const payload = {
        text: aboutText,
        logo: preview || null, // preview contains base64 string from upload
      };

      let res;
      if (aboutId) {
        res = await axios.put(
          `http://localhost:5000/api/AboutMe/${aboutId}`,
          payload
        );
      } else {
        res = await axios.post("http://localhost:5000/api/AboutMe", payload);
        setAboutId(res.data._id);
      }

      setAboutText(res.data.text);
      setPreview(res.data.logo || null);
      setPhoto(null);
      alert("About Me info saved successfully!");
    } catch (error) {
      console.error("Error saving About Me info:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        About Me
      </Typography>

      <TextField
        label="Write something about yourself here..."
        // placeholder="Write something about yourself here..."
        multiline
        rows={6}
        fullWidth
        value={aboutText}
        onChange={(e) => setAboutText(e.target.value)}
        sx={{ mb: 4 }}
      />
      {/* {aboutText && (
        <>
          <Button
            variant="outlined"
            color="error"
            onClick={handleText}
            disabled={loading}
            sx={{ mb: 4 }}
          >
            Clear text
          </Button>
        </>
      )} */}

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Button variant="contained" component="label" disabled={loading}>
          Upload Profile Photo
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoChange}
            disabled={loading}
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
