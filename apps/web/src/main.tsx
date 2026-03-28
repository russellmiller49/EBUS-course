import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from '@/app/App';
import { LearnerProgressProvider } from '@/lib/progress';
import '@/styles/index.css';

const app = (
  <BrowserRouter>
    <LearnerProgressProvider>
      <App />
    </LearnerProgressProvider>
  </BrowserRouter>
);

// The vtk.js / itk-wasm case viewer uses imperative rendering and widget setup that does
// not currently tolerate StrictMode's development-only effect replay.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(app);
