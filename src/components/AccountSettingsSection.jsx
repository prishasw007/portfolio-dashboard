import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography, TextField, Button, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from "@mui/material";

const AccountSettings = () => {
  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [typewriterWords, setTypewriterWords] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/AccountSettings/${id}`);
        const data = res.data;
        setName(data.name || "");
        setEmail(data.email || "");
        setLinkedin(data.linkedin || "");
        setGithub(data.github || "");
        setTypewriterWords(data.typewriterWords || "");
        setCurrentPassword(data.currentPassword || ""); // Optional
      } catch (err) {
        console.error("Failed to fetch account settings:", err);
      }
    };
    fetchSettings();
  }, [accountId]);

  const handleSave = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const payload = {
        name,
        email,
        linkedin,
        github,
        typewriterWords,
        currentPassword,
        newPassword,
      };

      await axios.put(`http://localhost:5000/api/AccountSettings/${id}`, payload);
      alert("Settings saved!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Error saving settings.");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/AccountSettings/${id}`);
      alert("Account deleted.");
      setDeleteDialogOpen(false);
      // Optional: redirect or clear UI
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting account.");
    }
  };

  return (
    <Box sx={{ maxWidth: 700, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>

      <Stack spacing={3}>
        <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="LinkedIn URL" fullWidth value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
        <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="GitHub URL" fullWidth value={github} onChange={(e) => setGithub(e.target.value)} />
        <TextField label="Typewriter Words (comma separated)" fullWidth value={typewriterWords} onChange={(e) => setTypewriterWords(e.target.value)} helperText="Words separated by commas" />

        <Typography variant="h6" mt={4}>Change Password</Typography>
        <TextField label="Current Password" type="password" fullWidth value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <TextField label="New Password" type="password" fullWidth value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <TextField label="Confirm New Password" type="password" fullWidth value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="contained" onClick={handleSave}>Save Changes</Button>
          <Button variant="outlined" color="error" onClick={() => setDeleteDialogOpen(true)}>Delete Account</Button>
        </Stack>
      </Stack>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete your account? This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountSettings;
