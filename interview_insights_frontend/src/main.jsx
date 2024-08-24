import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import store from './app/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));

console.log("Origin:", window.location.origin); // Check the origin here

root.render(
  <Provider store={store}>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

      <Router>
        <App />
      </Router>

  </GoogleOAuthProvider>    </Provider>
);
