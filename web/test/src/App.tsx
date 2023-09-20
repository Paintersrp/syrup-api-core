import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';

import './App.css';

import SyrupRoutes from './utils/SyrupRoutes';
import Navbar from './components/Navbar/Navbar';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <Navbar />
          <SyrupRoutes />
          {/* <Routes>
            <Route path="/app/users" element={<Users />} />
            <Route path="/app/profiles" element={<Profiles />} />
          </Routes> */}
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
