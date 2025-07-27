import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { TaskProvider } from './context/TaskContext.jsx'
import Auth0ProviderWithHistory from './auth/Auth0ProviderwithHistory.jsx';


const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
console.log('Auth0 domain:', domain, 'clientId:', clientId);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Temporarily removing React.StrictMode to fix createRoot error
  // React.StrictMode causes double rendering which conflicts with Auth0 provider
  <BrowserRouter>
    <Auth0ProviderWithHistory>
      <TaskProvider>
        <App />
      </TaskProvider>
    </Auth0ProviderWithHistory>
  </BrowserRouter>
);