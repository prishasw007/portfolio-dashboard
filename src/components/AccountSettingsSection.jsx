import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography, TextField, Button, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from "@mui/material";

const AccountSettings = () => {
  const [accountId, setAccountId] = useState(null); // store _id for update/delete
  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [typewriterWords, setTypewriterWords] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch current settings once on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/AccountSettings"); // fetch all settings
        if (res.data.length > 0) {
          const data = res.data[0]; // get first item
          setAccountId(data._id);
          setName(data.name || "");
          setEmail(data.email || "");
          setLinkedin(data.linkedin || "");
          setGithub(data.github || "");
          setTypewriterWords(data.typewriterWords || "");
        }
      } catch (err) {
        console.error("Failed to fetch account settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!accountId) {
      alert("No account to update.");
      return;
    }

    const payload = {
      name,
      email,
      linkedin,
      github,
      typewriterWords,
    };

    try {
      await axios.put(`http://localhost:5000/api/AccountSettings/${accountId}`, payload);
      alert("Settings saved!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Error saving settings.");
    }
  };

  const confirmDelete = async () => {
    if (!accountId) {
      alert("No account to delete.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/AccountSettings/${accountId}`);
      alert("Account deleted.");
      setDeleteDialogOpen(false);

      // Optional: Clear state or redirect user
      setAccountId(null);
      setName("");
      setEmail("");
      setLinkedin("");
      setGithub("");
      setTypewriterWords("");
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
        <TextField
          label="Typewriter Words (comma separated)"
          fullWidth
          value={typewriterWords}
          onChange={(e) => setTypewriterWords(e.target.value)}
          helperText="Words separated by commas"
        />

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="contained" onClick={handleSave} disabled={!accountId}>
            Save Changes
          </Button>
          <Button variant="outlined" color="error" onClick={() => setDeleteDialogOpen(true)} disabled={!accountId}>
            Delete Account
          </Button>
        </Stack>
      </Stack>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete your account? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountSettings;
