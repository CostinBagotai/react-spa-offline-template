import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from './screens/NotFound';
import Home from './screens/Home';

const App = () => {
    return(
        <Routes>
            <Route path={'/'} element={<Home/>} />

            {/* Not found Route - Always last */}
            <Route path={'*'} element={<NotFound />} />
        </Routes>
    );
};

export default App;