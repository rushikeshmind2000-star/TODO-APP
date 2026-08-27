import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AppRouter from './routes/AppRouter';
import './index.css';

function ThemeManager({ children }) {
  const { theme } = useApp();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, [theme]);

  return children;
}

function App() {
  return (
    <AppProvider>
      <ThemeManager>
        <AppRouter />
      </ThemeManager>
    </AppProvider>
  );
}

export default App;
