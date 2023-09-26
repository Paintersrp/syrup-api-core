import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

import { SyrupRouter } from './core/router/SyrupRouter';

import routes from './routesConfig';
import { ParamProvider } from './core/router/params/ParamProvider';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <ParamProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <SyrupRouter
            loadingComponent={<div>Loading</div>}
            errorComponent={<div>Not Found</div>}
            routes={routes}
          />
        </HelmetProvider>
      </QueryClientProvider>
    </ParamProvider>
  );
};

export default App;
