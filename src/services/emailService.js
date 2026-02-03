import { Alert } from 'react-native';

export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const res = await fetch("https://gzdiqqqvqocurvtivuyx.supabase.co/functions/v1/send-reset", {
      method: "POST",
      headers: { 
        'Content-Type': "application/json",
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6ZGlxcXF2cW9jdXJ2dGl2dXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDQ4NDAsImV4cCI6MjA3NDg4MDg0MH0.IKkAzNlncfP_gL-QBtdjSnrnHzWUPH-NvZKQWtFpNS0' },
      
      body: JSON.stringify({ 
        email: email, 
        resetToken: resetToken, 
        userName: userName }),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};
