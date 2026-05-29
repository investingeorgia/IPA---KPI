// ============================================================
// main.jsx — Vite entry point
// ============================================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles.css';
import App from './App';
import { DataProvider } from '@shared/contexts/DataContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </StrictMode>
);
