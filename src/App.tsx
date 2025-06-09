import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MonitoringDashboard from './components/MonitoringDashboard';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <MonitoringDashboard />
      </DndProvider>
    </ChakraProvider>
  );
}

export default App;