import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';

import './App.css';

// import { Profiles } from './pages/Profiles/page';
// import { Navbar } from './components/Navbar/Navbar';
// import Users from './pages/Users/page';
import AppRoutes from './utils/AppRoutes';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        {/* <Router>
          <Navbar />
          <Routes>
            <Route path="/app/users" element={<Users />} />
            <Route path="/app/profiles" element={<Profiles />} />
          </Routes>
        </Router> */}
        <AppRoutes />
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
