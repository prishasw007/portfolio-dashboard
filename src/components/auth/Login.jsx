import React, { useState } from "react";
import {Box,Paper,Typography,Button,Link,IconButton,InputAdornment,FormControl,InputLabel,OutlinedInput,} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Paper
        elevation={3}
        component="form"
        onSubmit={handleSubmit}
        className="w-full rounded shadow bg-white"
        sx={{ maxWidth: 700, px: 6, py: 8 }}
      >
        <Typography
          variant="h5"
          component="h1"
          className="text-center"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Sign In
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
            slotProps={{
              input: {
                autoComplete: "email",
              },
            }}
          />
        </FormControl>

        {/* Password Field */}
        <FormControl fullWidth required sx={{ mb: 6 }} variant="outlined">
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            slotProps={{
              input: {
                autoComplete: "current-password",
              },
            }}
          />
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="bg-blue-600 hover:bg-blue-700 font-medium text-white"
          sx={{ py: 2.5 }}
        >
          Login
        </Button>

        <Box className="text-center" sx={{ mt: 3 }}>
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Forgot Password?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
