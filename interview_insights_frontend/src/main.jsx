import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import store from './app/store';


const root = ReactDOM.createRoot(document.getElementById('root'));

console.log("Origin:", window.location.origin); // Check the origin here

root.render(
  <Provider store={store}>
  <GoogleOAuthProvider clientId={'250807523474-f1r1ch6t4t0lgi42ar72ce3svngss5d5.apps.googleusercontent.com'}>

      <Router>
        <App />
      </Router>

  </GoogleOAuthProvider>    </Provider>
);
