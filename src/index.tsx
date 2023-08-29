import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './store';

// Create a small wrapper for rendering
const renderApp = () => {
    const container = document.getElementById('app');
    const root = createRoot(container!);
    root.render(
        <Provider store={store}>
            <HashRouter>
                <App />
            </HashRouter>
        </Provider>
    );
}

// Render the App
renderApp();