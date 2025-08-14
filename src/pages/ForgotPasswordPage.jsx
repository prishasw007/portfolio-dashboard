import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Link,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset link sent to:", email); // Replace with actual logic
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        margin: 0,
        padding: 0,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={6}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 5,
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "700",
            mb: 4,
            color: "primary.main",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Forgot Password
        </Typography>

        <Typography
          sx={{
            mb: 4,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          Enter your email address below. We'll send you a link to reset your password.
        </Typography>

        {/* Email Field */}
        <FormControl fullWidth required sx={{ mb: 4 }} variant="outlined">
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            sx={{
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            }}
          />
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            py: 2.5,
            fontWeight: "bold",
            fontSize: "1rem",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            transition: "all 0.3s ease",
          }}
        >
          Send Reset Link
        </Button>

        {/* Back to Login */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              color: "primary.light",
              fontWeight: 500,
              "&:hover": { color: "primary.main" },
            }}
          >
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;
