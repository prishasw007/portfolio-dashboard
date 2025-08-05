import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset link sent to:", email); // Replace with actual logic
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Paper
        elevation={3}
        component="form"
        onSubmit={handleSubmit}
        className="w-full rounded shadow bg-white"
        sx={{
          maxWidth: 700,
          px: 6,
          py: 8,
        }}
      >
        <Typography variant="h5" component="h1" className="text-center" sx={{ fontWeight: 'bold', mt: 3 }}>
          Forgot Password
        </Typography>

        <Typography className="text-center" sx ={{mb: 4}}>
          Enter your email address below. We'll send you a link to reset your password.
        </Typography>

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          sx={{ mb: 5 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="bg-blue-600 hover:bg-blue-700 font-medium text-white"
          sx={{ py: 2.5 }}
        >
          Send Reset Link
        </Button>

        <Box className="text-center" sx={{ mt: 3 }}>
          <Link
            component={RouterLink}
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;
