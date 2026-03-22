import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HelmetProvider} from 'react-helmet-async';
import {DataProvider} from './context/DataContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </HelmetProvider>
  </StrictMode>,
);
