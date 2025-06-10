import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/views';
import AppRouter from './components/layouts/AppRouter';
import theme from './theme';
import { Box, Spinner, Flex } from '@chakra-ui/react';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" color="primary.500" thickness="4px" />
      </Flex>
    );
  }

  return isAuthenticated ? children : <Login />;
};

// Main App Router Component
const MainRouter = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <ProtectedRoute>
        <AppRouter />
      </ProtectedRoute>
    </DndProvider>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <MainRouter />
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;