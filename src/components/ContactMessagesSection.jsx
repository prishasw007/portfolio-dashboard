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

const ContactMessagesSection = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const selectedMessage = messages.find((msg) => msg._id === selectedMessageId);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ContactMessages");
        setMessages(res.data);
      } catch (error) {
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
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contact Messages
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Messages List */}
        <Paper sx={{ flex: 1, maxHeight: 400, overflowY: "auto", p: 2 }}>
          {messages.length === 0 ? (
            <Typography color="text.secondary">No messages.</Typography>
          ) : (
            <List>
              {messages.map(({ _id, name, email, message }) => (
                <React.Fragment key={_id}>
                  <ListItem
                    button
                    selected={selectedMessageId === _id}
                    onClick={() => setSelectedMessageId(_id)}
                  >
                    <ListItemText
                      primary={`${name} (${email})`}
                      secondary={
                        message.length > 50
                          ? message.slice(0, 50) + "..."
                          : message
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        {/* Selected Message Detail */}
        <Paper
          sx={{
            flex: 1,
            p: 3,
            maxHeight: 400,
            overflowY: "auto",
            display: selectedMessage ? "block" : "none",
          }}
        >
          {selectedMessage && (
            <>
              <Typography variant="h6" gutterBottom>
                From: {selectedMessage.name} ({selectedMessage.email})
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {selectedMessage.message}
              </Typography>

              <Button
                variant="contained"
                color="error"
                sx={{ mt: 3 }}
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
