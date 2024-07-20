import React, { useState, useRef, useEffect } from "react";
import { Send } from "@mui/icons-material";
import { Box, Container, Divider, IconButton, Paper, TextField, Typography } from "@mui/material";
import { localStorageAPI } from "../localStorageAPI";
import PendingIcon from '@mui/icons-material/Pending';
import ReactMarkdown from 'react-markdown';
import { styled } from '@mui/material/styles';


const TypingIndicator = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    marginTop: '20px',
    marginLeft: '5px',
    '& span': {
        display: 'inline-block',
        width: '8px',
        height: '8px',
        margin: '0 2px',
        borderRadius: '50%',
        backgroundColor: '#888',
        animation: 'typing 1.2s infinite',
    },
    '& span:nth-of-type(1)': {
        animationDelay: '0s',
    },
    '& span:nth-of-type(2)': {
        animationDelay: '0.2s',
    },
    '& span:nth-of-type(3)': {
        animationDelay: '0.4s',
    },
    '@keyframes typing': {
        '0%': {
            transform: 'translateY(0)',
            opacity: 0.3,
        },
        '50%': {
            transform: 'translateY(-6px)',
            opacity: 1,
        },
        '100%': {
            transform: 'translateY(0)',
            opacity: 0.3,
        }
    }
}))

export function AskAI() {
    const localMessages = localStorageAPI().getData('ai-chat-messages')
    const [messages, setMessages] = useState(localMessages || []);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const currentTrainingPlan = localStorageAPI().getData('currentTrainingPlanId')

    useEffect(() => {
        localStorageAPI().saveData('ai-chat-messages', messages)
    }, [messages]);

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
            document.getElementById(lastMessage.id)?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    function handleSendMessage() {
        if (input) {
            setInput('');
            setMessages([...messages, { user: 'You', text: input, id: Date.now() }]);
            setLoading(true);
            fetch('/api/askAI', {
                method: 'POST',
                body: JSON.stringify({
                    text: input,
                    currentTrainingPlan
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setMessages(prevMessages => [...prevMessages, { user: 'AI', text: data.result, apiPrice: data.apiPrice, id: Date.now() }]);
                    setLoading(false);

                });
        }

    }

    return <div id="chat_container">
        <Container maxWidth="sm" sx={{ p: 1 }}>
            <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column', }}>
                <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
                    {messages.map((message, index) => (
                        <>
                            <div id={message.id}></div>
                            {
                                message.user === 'You' ? <Typography key={index}
                                    variant="body1"
                                    sx={{
                                        mb: 1,

                                        paddingRight: 1,
                                        paddingLeft: 1,
                                        border: '1px solid gray',
                                        borderRadius: '10px',
                                        backgroundColor: '#e2ebf4'
                                    }}>
                                    <ReactMarkdown>{`**${message.user}**: ${message.text}`}</ReactMarkdown>
                                </Typography> : <Typography key={index}
                                    variant="body1"
                                    sx={{ mb: 1, p: 1 }}
                                    align={message.user === 'You' ? 'right' : 'left'}>
                                    <ReactMarkdown>{`**${message.user}**: ${message.text}`}</ReactMarkdown>
                                </Typography>
                            }

                            {message.apiPrice && <Typography
                                sx={{
                                    mb: 1,
                                    p: 1
                                }}
                                variant="caption" color="textSecondary">Price: {message.apiPrice}</Typography>}
                        </>
                    ))}
                    {loading && (
                        <TypingIndicator>
                            <span></span>
                            <span></span>
                            <span></span>
                        </TypingIndicator>
                    )}

                </Box >
                <Box sx={{ display: 'flex', padding: 2 }}>
                    <TextField
                        placeholder="Type a message..."
                        fullWidth
                        variant="outlined"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSendMessage();
                        }}
                    />
                    <IconButton color="primary" onClick={handleSendMessage}>
                        <Send />
                    </IconButton>
                </Box>
            </Paper>
        </Container>
    </div>

}