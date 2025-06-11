// src/components/SystemManagementPage.jsx
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
  Settings,
  Users,
  UserCheck,
  Shield,
  Sliders
} from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 1. IMPORTS
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme';

// Hooks and Contexts
import { useAuth } from '../../contexts/AuthContext';

// Placeholder components for sub-modules
const RoleManagementSubModule = () => (
  <Box p={6} h="100%" display="flex" alignItems="center" justifyContent="center">
    <VStack spacing={4}>
      <Settings size={48} color={useColorModeValue('#3182ce', '#63b3ed')} />
      <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
        Gestión de Roles
      </Text>
      <Text fontSize="md" color={useColorModeValue('gray.600', 'app.text.secondary')} textAlign="center">
        Módulo en desarrollo...
      </Text>
    </VStack>
  </Box>
);

const RoleAssignmentSubModule = () => (
  <Box p={6} h="100%" display="flex" alignItems="center" justifyContent="center">
    <VStack spacing={4}>
      <UserCheck size={48} color={useColorModeValue('#3182ce', '#63b3ed')} />
      <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
        Asignación de Roles
      </Text>
      <Text fontSize="md" color={useColorModeValue('gray.600', 'app.text.secondary')} textAlign="center">
        Módulo en desarrollo...
      </Text>
    </VStack>
  </Box>
);

const PermissionsConfigSubModule = () => (
  <Box p={6} h="100%" display="flex" alignItems="center" justifyContent="center">
    <VStack spacing={4}>
      <Shield size={48} color={useColorModeValue('#3182ce', '#63b3ed')} />
      <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
        Configuración de Permisos
      </Text>
      <Text fontSize="md" color={useColorModeValue('gray.600', 'app.text.secondary')} textAlign="center">
        Módulo en desarrollo...
      </Text>
    </VStack>
  </Box>
);

const GeneralConfigSubModule = () => (
  <Box p={6} h="100%" display="flex" alignItems="center" justifyContent="center">
    <VStack spacing={4}>
      <Sliders size={48} color={useColorModeValue('#3182ce', '#63b3ed')} />
      <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'app.text.primary')}>
        Configuración General
      </Text>
      <Text fontSize="md" color={useColorModeValue('gray.600', 'app.text.secondary')} textAlign="center">
        Módulo en desarrollo...
      </Text>
    </VStack>
  </Box>
);

// Main SystemManagementPage Component
const SystemManagementPage = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [activeSubModule, setActiveSubModule] = useState('roles'); // Default to roles

  const bgColor = useColorModeValue('app.bg.primary', 'app.bg.primary');
  const headerBg = useColorModeValue('app.surface.header', 'app.surface.header');
  const sidebarBg = useColorModeValue('white', '#252a36');

  const subModules = [
    {
      id: 'roles',
      name: 'Gestión de Roles',
      icon: Users,
      component: RoleManagementSubModule
    },
    {
      id: 'assignment',
      name: 'Asignación de Roles',
      icon: UserCheck,
      component: RoleAssignmentSubModule
    },
    {
      id: 'permissions',
      name: 'Permisos',
      icon: Shield,
      component: PermissionsConfigSubModule
    },
    {
      id: 'general',
      name: 'Configuración General',
      icon: Sliders,
      component: GeneralConfigSubModule
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
                ⚙️ Administración del Sistema
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
            {/* Left Sidebar - System Sub-modules Navigation */}
            <Box
              w="280px"
              minW="280px"
              bg={sidebarBg}
              borderRight="1px"
              borderColor={useColorModeValue('gray.200', 'transparent')}
              p={5}
            >
              <Text fontSize="lg" fontWeight="600" color={useColorModeValue('gray.800', 'app.text.primary')} mb={6}>
                Módulos del Sistema
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
              bg={useColorModeValue('gray.50', '#1a1d29')}
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

export default SystemManagementPage;