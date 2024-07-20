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
  <GoogleOAuthProvider clientId={'678111264994-o1ccqt38dekda04159f1aggbdq9n5c0e.apps.googleusercontent.com'}>

      <Router>
        <App />
      </Router>

  </GoogleOAuthProvider>    </Provider>
);
