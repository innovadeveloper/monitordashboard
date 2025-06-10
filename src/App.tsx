import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MonitoringDashboard, Login } from './components/views';
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

// Main App Router
const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <DndProvider backend={HTML5Backend}>
      <ProtectedRoute>
        <MonitoringDashboard />
      </ProtectedRoute>
    </DndProvider>
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;