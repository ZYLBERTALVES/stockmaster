import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import './styles.css';
import App from './App';
import { EstoqueProvider } from './context/EstoqueContext';

createRoot(document.body).render(
  <StrictMode>
    <EstoqueProvider>
      <App />
    </EstoqueProvider>
  </StrictMode>,
);
