import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import { App } from '@/app/App';
import { SupabaseSyncProvider } from '@/features/supabase/SupabaseSyncProvider';
import { LearnerProgressProvider } from '@/lib/progress';
import '@/styles/index.css';

const Router = import.meta.env.BASE_URL !== '/' ? HashRouter : BrowserRouter;

const app = (
  <Router>
    <LearnerProgressProvider>
      <SupabaseSyncProvider>
        <App />
      </SupabaseSyncProvider>
    </LearnerProgressProvider>
  </Router>
);

// The vtk.js / itk-wasm case viewer uses imperative rendering and widget setup that does
// not currently tolerate StrictMode's development-only effect replay.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(app);
