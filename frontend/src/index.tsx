import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components';
import { ChakraProvider } from '@chakra-ui/react';
import { PrimeReactProvider } from 'primereact/api';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </ChakraProvider>
  </React.StrictMode>
);
