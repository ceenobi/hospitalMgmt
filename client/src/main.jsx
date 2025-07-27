import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        console.log('ServiceWorker registration successful');
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Web Vitals Reporting
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Function to log Web Vitals
const sendToAnalytics = ({ name, delta, id }) => {
  console.log(`Web Vitals: ${name}`, delta, id);
  // You can send these metrics to your analytics service here
};

// Initialize Web Vitals reporting
reportWebVitals(sendToAnalytics);

// Render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
