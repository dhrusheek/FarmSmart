import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { store } from './store';
import AppRouter from './router/AppRouter';
import './index.css';

function AppContent() {
  const { i18n } = useTranslation();
  const { user } = useSelector((state) => state.auth);

  // Load user's preferred language on app initialization
  useEffect(() => {
    if (user?.preferredLanguage) {
      i18n.changeLanguage(user.preferredLanguage);
    }
  }, [user, i18n]);

  return <AppRouter />;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
