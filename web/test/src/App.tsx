import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';

import './App.css';
import { Users } from './components/Users/Users';
import { Profiles } from './components/Profiles/Profiles';
import { Navbar } from './components/Navbar/Navbar';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/app/users" element={<Users />} />
            <Route path="/app/profiles" element={<Profiles />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
