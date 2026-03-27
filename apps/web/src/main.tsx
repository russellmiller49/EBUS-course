import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from '@/app/App';
import { LearnerProgressProvider } from '@/lib/progress';
import '@/styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <LearnerProgressProvider>
        <App />
      </LearnerProgressProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
