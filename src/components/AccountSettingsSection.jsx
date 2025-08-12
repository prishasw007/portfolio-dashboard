import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

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
        const res = await axios.get(
          "http://localhost:5000/api/AccountSettings"
        ); // fetch all settings
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
        toast.error("Failed to fetch account settings");
        console.error("Failed to fetch account settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!accountId) {
      toast("No account to update", {
        icon: "⚠️",
        style: { background: "#fff3cd", color: "#856404" },
      });
      // alert("No account to update.");
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
      await axios.put(
        `http://localhost:5000/api/AccountSettings/${accountId}`,
        payload
      );
      toast.success("Settings saved!");
      // alert("Settings saved!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings");
      // alert("Error saving settings.");
    }
  };

  const confirmDelete = async () => {
    if (!accountId) {
      toast("No account to delete.", {
        icon: "⚠️",
        style: { background: "#fff3cd", color: "#856404" },
      });
      // alert("No account to delete.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/AccountSettings/${accountId}`
      );
      toast.success("Account deleted");
      // alert("Account deleted.");
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
      toast.error("Error deleting account");
      // alert("Error deleting account.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 700,
        p: 4,
        mx: "auto",
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      <Toaster position="top-right" />
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 4,
          textAlign: "center",
          color: "primary.main",
        }}
      >
        Account Settings
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            bgcolor: "#f9f9f9",
            borderRadius: 1,
            "& .MuiInputBase-root": { p: "12px" },
            boxShadow: "inset 0 0 6px #e0e0e0",
          }}
        />
        <TextField
          label="LinkedIn URL"
          fullWidth
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          sx={{
            bgcolor: "#f9f9f9",
            borderRadius: 1,
            "& .MuiInputBase-root": { p: "12px" },
            boxShadow: "inset 0 0 6px #e0e0e0",
          }}
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            bgcolor: "#f9f9f9",
            borderRadius: 1,
            "& .MuiInputBase-root": { p: "12px" },
            boxShadow: "inset 0 0 6px #e0e0e0",
          }}
        />
        <TextField
          label="GitHub URL"
          fullWidth
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          sx={{
            bgcolor: "#f9f9f9",
            borderRadius: 1,
            "& .MuiInputBase-root": { p: "12px" },
            boxShadow: "inset 0 0 6px #e0e0e0",
          }}
        />
        <TextField
          label="Typewriter Words (comma separated)"
          fullWidth
          value={typewriterWords}
          onChange={(e) => setTypewriterWords(e.target.value)}
          helperText="Words separated by commas"
          sx={{
            bgcolor: "#f9f9f9",
            borderRadius: 1,
            "& .MuiInputBase-root": { p: "12px" },
            boxShadow: "inset 0 0 6px #e0e0e0",
          }}
        />

        <Stack direction="row" spacing={2} mt={4} justifyContent="center">
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!accountId}
            sx={{
              px: 5,
              py: 1.5,
              fontWeight: 700,
              fontSize: 16,
              textTransform: "none",
              boxShadow: "0 5px 15px rgba(25,118,210,0.4)",
              "&:hover": {
                boxShadow: "0 7px 21px rgba(25,118,210,0.6)",
              },
            }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={!accountId}
            sx={{
              px: 5,
              py: 1.5,
              fontWeight: 700,
              fontSize: 16,
              textTransform: "none",
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                boxShadow: "0 6px 20px rgba(211,47,47,0.4)",
              },
            }}
          >
            Delete Account
          </Button>
        </Stack>
      </Stack>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            maxWidth: 400,
            mx: "auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent sx={{ fontSize: 16, color: "text.primary" }}>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </DialogContent>
        <DialogActions sx={{ pt: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ px: 3 }}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={confirmDelete}
            sx={{
              px: 3,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 5px 15px rgba(211,47,47,0.6)",
              "&:hover": {
                boxShadow: "0 7px 21px rgba(211,47,47,0.8)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountSettings;
