import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  Badge,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { Bell, User } from 'lucide-react';
import BusList from './BusList';
import VideoGrid from './VideoGrid';
import CameraSelectionModal from './CameraSelectionModal';

const MonitoringDashboard = () => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [targetPanel, setTargetPanel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoPanels, setVideoPanels] = useState([
    { id: 1, bus: null, camera: null, status: 'empty' },
    { id: 2, bus: null, camera: null, status: 'empty' },
    { id: 3, bus: null, camera: null, status: 'empty' },
    { id: 4, bus: null, camera: null, status: 'empty' },
  ]);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('gray.800', 'gray.800');

  const handleBusDrop = (bus, panelId) => {
    setSelectedBus(bus);
    setTargetPanel(panelId);
    setIsModalOpen(true);
  };

  const handleCameraSelect = (cameraType) => {
    setVideoPanels(prev => prev.map(panel => 
      panel.id === targetPanel 
        ? { ...panel, bus: selectedBus, camera: cameraType, status: 'active' }
        : panel
    ));
    setIsModalOpen(false);
    setSelectedBus(null);
    setTargetPanel(null);
  };

  const handlePanelClose = (panelId) => {
    setVideoPanels(prev => prev.map(panel => 
      panel.id === panelId 
        ? { ...panel, bus: null, camera: null, status: 'empty' }
        : panel
    ));
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Flex
        bg={headerBg}
        color="white"
        px={6}
        py={4}
        align="center"
        justify="space-between"
      >
        <HStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold">
            🚌 Monitoreo GPS y Flota
          </Text>
        </HStack>
        
        <HStack spacing={4}>
          <IconButton
            icon={<Bell size={20} />}
            variant="ghost"
            color="white"
            bg="red.500"
            size="sm"
            borderRadius="md"
          />
          <Text fontSize="sm" bg="red.500" px={2} py={1} borderRadius="md">
            Centro de Alertas
          </Text>
          <IconButton
            icon={<User size={20} />}
            variant="ghost"
            color="white"
            bg="gray.600"
            size="sm"
            borderRadius="md"
          />
          <Text fontSize="sm" bg="gray.600" px={2} py={1} borderRadius="md">
            AC
          </Text>
        </HStack>
      </Flex>

      {/* Status Bar */}
      <Flex bg="white" px={6} py={3} borderBottom="1px" borderColor="gray.200">
        <HStack spacing={6}>
          <HStack>
            <Box w={3} h={3} bg="red.500" borderRadius="full" />
            <Text fontSize="sm" color="gray.600">3 Alertas Críticas</Text>
          </HStack>
          <HStack>
            <Box w={3} h={3} bg="orange.500" borderRadius="full" />
            <Text fontSize="sm" color="gray.600">7 Advertencias</Text>
          </HStack>
          <HStack>
            <Box w={3} h={3} bg="green.500" borderRadius="full" />
            <Text fontSize="sm" color="gray.600">85 Unidades Activas</Text>
          </HStack>
          <HStack>
            <Box w={3} h={3} bg="orange.500" borderRadius="full" />
            <Text fontSize="sm" color="gray.600">5 Con Retraso</Text>
          </HStack>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Flex h="calc(100vh - 120px)">
        {/* Left Sidebar - Bus List */}
        <Box w="320px" bg="white" borderRight="1px" borderColor="gray.200">
          <BusList onBusDrop={handleBusDrop} />
        </Box>

        {/* Center - Video Grid */}
        <Flex flex={1} direction="column">
          <VideoGrid 
            panels={videoPanels}
            onBusDrop={handleBusDrop}
            onPanelClose={handlePanelClose}
          />
        </Flex>
      </Flex>

      {/* Camera Selection Modal */}
      <CameraSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bus={selectedBus}
        onCameraSelect={handleCameraSelect}
      />
    </Box>
  );
};

export default MonitoringDashboard;