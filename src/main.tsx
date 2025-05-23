import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, useAuth } from './auth/AuthProvider.tsx';
import { ColorModeProvider } from './components/ui/color-mode.tsx';
import './i18n/config';
import { routeTree } from './routeTree.gen.ts';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

const App = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </React.StrictMode>
);
