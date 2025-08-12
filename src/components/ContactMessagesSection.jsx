import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Paper,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

const ContactMessagesSection = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const selectedMessage = messages.find((msg) => msg._id === selectedMessageId);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/ContactMessages"
        );
        setMessages(res.data);
      } catch (error) {
        toast.error("Failed to fetch messages");
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, []);

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ContactMessages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      if (selectedMessageId === id) {
        setSelectedMessageId(null);
      }
    } catch (error) {
      toast.error("Failed to fetch messages");
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
      <Toaster position="top-right" />

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "primary.main",
          mb: 4,
          textAlign: "center",
        }}
      >
        Contact Messages
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
        }}
      >
        {/* Messages List */}
        <Paper
          elevation={4}
          sx={{
            flex: 1,
            maxHeight: 450,
            overflowY: "auto",
            p: 2,
            borderRadius: 3,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            bgcolor: "background.paper",
          }}
        >
          {messages.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ fontStyle: "italic", textAlign: "center", mt: 4 }}
            >
              No messages.
            </Typography>
          ) : (
            <List disablePadding>
              {messages.map(({ _id, name, email, message }) => (
                <React.Fragment key={_id}>
                  <ListItem
                    button
                    selected={selectedMessageId === _id}
                    onClick={() => setSelectedMessageId(_id)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      "&.Mui-selected": {
                        bgcolor: "primary.light",
                        "&:hover": { bgcolor: "primary.main", color: "white" },
                      },
                      "&:hover": {
                        bgcolor: "action.hover",
                        cursor: "pointer",
                      },
                      flexDirection: "column",
                      alignItems: "flex-start",
                      py: 1.5,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, width: "100%" }}
                    >
                      {name}{" "}
                      <Typography component="span" color="text.secondary">
                        ({email})
                      </Typography>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        width: "100%",
                        overflowWrap: "break-word",
                      }}
                    >
                      {message.length > 50
                        ? message.slice(0, 50) + "..."
                        : message}
                    </Typography>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        {/* Selected Message Detail */}
        <Paper
          elevation={4}
          sx={{
            flex: 1,
            p: 3,
            maxHeight: 450,
            overflowY: "auto",
            borderRadius: 3,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            bgcolor: "background.paper",
            display: selectedMessage ? "block" : "none",
          }}
        >
          {selectedMessage && (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                From: {selectedMessage.name}{" "}
                <Typography component="span" color="text.secondary">
                  ({selectedMessage.email})
                </Typography>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  mb: 3,
                  fontSize: 16,
                  lineHeight: 1.6,
                }}
              >
                {selectedMessage.message}
              </Typography>

              <Button
                variant="contained"
                color="error"
                sx={{
                  mt: 1,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(211,47,47,0.4)",
                  "&:hover": {
                    boxShadow: "0 6px 18px rgba(211,47,47,0.6)",
                  },
                }}
                onClick={() => deleteMessage(selectedMessage._id)}
              >
                Delete Message
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ContactMessagesSection;
