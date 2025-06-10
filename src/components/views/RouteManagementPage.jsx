// src/components/RouteManagementPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { 
  Home, 
  User, 
  ChevronDown, 
  Sun, 
  Moon,
  Route,
  MapPin
} from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 1. IMPORTS
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme';

// Sub-modules
import RouteRegistrySubModule from './RouteRegistrySubModule';
import RouteOptimizationSubModule from './RouteOptimizationSubModule';

// UI Components
import { ResourcesModulesMenu } from '../ui';

// Hooks and Contexts
import { useAuth } from '../../contexts/AuthContext';

// Main RouteManagementPage Component
const RouteManagementPage = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [activeSubModule, setActiveSubModule] = useState('rutas'); // Default to routes

  const bgColor = useColorModeValue('app.bg.primary', 'app.bg.primary');
  const headerBg = useColorModeValue('app.surface.header', 'app.surface.header');
  const sidebarBg = useColorModeValue('white', '#252a36');

  const subModules = [
    {
      id: 'rutas',
      name: 'Registro de Rutas',
      icon: Route,
      description: 'Gestión de rutas y paradas',
      component: RouteRegistrySubModule
    },
    {
      id: 'optimizacion',
      name: 'Optimización de Rutas',
      icon: MapPin,
      description: 'Análisis y optimización de recorridos',
      component: RouteOptimizationSubModule
    }
  ];

  const renderActiveComponent = () => {
    const activeModule = subModules.find(module => module.id === activeSubModule);
    if (activeModule) {
      const Component = activeModule.component;
      return <Component />;
    }
    return null;
  };

  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
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
              <Button
                leftIcon={<Home size={16} />}
                onClick={() => navigate('/dashboard')}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{
                  bg: 'whiteAlpha.200',
                  transform: 'translateY(-1px)'
                }}
                _active={{
                  transform: 'translateY(0px)'
                }}
                transition="all 0.2s"
              >
                Inicio
              </Button>
              <Text fontSize="xl" fontWeight="bold">
                🗺️ Gestión de Rutas
              </Text>
            </HStack>

            <HStack spacing={4}>
              {/* Theme Toggle Button */}
              <IconButton
                icon={colorMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                onClick={toggleColorMode}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{
                  bg: 'whiteAlpha.200',
                }}
                aria-label={colorMode === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
              />

              <ResourcesModulesMenu 
                activeSubModule="rutas"
                onSubModuleChange={() => navigate('/resources')}
              />
              
              <Menu>
                <MenuButton
                  as={Button}
                  leftIcon={<User size={16} />}
                  colorScheme="gray"
                  size="sm"
                  variant="solid"
                  rightIcon={<ChevronDown size={14} />}
                >
                  {user?.name || 'Usuario'}
                </MenuButton>
                <Portal>
                  <MenuList>
                    <MenuItem onClick={logout}>
                      Cerrar Sesión
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </HStack>
          </Flex>

          {/* Main Content */}
          <Flex h="calc(100vh - 80px)" overflow="hidden">
            {/* Left Sidebar - Route Sub-modules Navigation */}
            <Box
              w="280px"
              minW="280px"
              bg={sidebarBg}
              borderRight="1px"
              borderColor={useColorModeValue('gray.200', 'transparent')}
              p={5}
            >
              <Text fontSize="lg" fontWeight="600" color={useColorModeValue('gray.800', 'app.text.primary')} mb={6}>
                Módulos de Rutas
              </Text>

              <VStack spacing={3} align="stretch">
                {subModules.map((module) => {
                  const Icon = module.icon;
                  const isActive = activeSubModule === module.id;
                  
                  return (
                    <Button
                      key={module.id}
                      leftIcon={<Icon size={18} />}
                      variant={isActive ? "solid" : "ghost"}
                      colorScheme={isActive ? "blue" : "gray"}
                      justifyContent="flex-start"
                      size="md"
                      w="100%"
                      onClick={() => setActiveSubModule(module.id)}
                      _hover={{
                        bg: isActive ? 'blue.600' : useColorModeValue('gray.100', 'gray.600')
                      }}
                      transition="all 0.2s"
                    >
                      {module.name}
                    </Button>
                  );
                })}
              </VStack>
            </Box>

            {/* Main Content Area */}
            <Box 
              flex={1} 
              bg={useColorModeValue('white', '#252a36')}
              overflow="hidden"
              w="calc(100% - 280px)"
            >
              {renderActiveComponent()}
            </Box>
          </Flex>
        </Box>
      </DndProvider>
    </ChakraProvider>
  );
};

export default RouteManagementPage;