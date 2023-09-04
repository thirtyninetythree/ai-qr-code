import React, { useState } from 'react';

import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"

import { Navbar, Footer, Notifications } from './components'
import { Generate, Prompts, Landing } from './pages';
import "./fonts.css"


// Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a theme with the custom font
const theme = createTheme({
  typography: {
    fontFamily: "Raleway, sans-serif",
  },
  components: {
    NavLink: {
      defaultProps: {
        style: {
          textDecoration: 'none',
          color: 'black',
        },
      },
    },
  },
  
});

// Wrap your app with the theme provider
function App() {
//NOTIFICATION STATE HANDLERS
const [open, setOpen] = useState(false)
const [errorMessage, setErrorMessage] = useState("Test")
const [messageSeverity, setMessageSeverity] = useState("error")

function handleNotifications(message, severity) {
  setOpen(true)
  setErrorMessage(message)
  setMessageSeverity(severity)
}

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <main>
          <Navbar />
          <Routes>
            <Route index element={<Landing />} />
            <Route path="/generate" element={<Generate handleNotifications={handleNotifications}/>} />
            <Route path="/prompts" element={<Prompts handleNotifications={handleNotifications}/>} />
          </Routes>
          <Notifications open={open} setOpen={setOpen} error={errorMessage} severity={messageSeverity}/>
          {/* <Footer /> */}
        </main>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

