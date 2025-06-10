import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  Grid,
  GridItem,
  Box,
  VStack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { 
  Grid3X3, 
  ChevronDown, 
  MapPin,
  BarChart3,
  Settings,
  AlertTriangle,
  Users,
  TrendingUp
} from 'lucide-react';

const ModulesMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isOpen: isModulesMenuOpen, onOpen: onModulesMenuOpen, onClose: onModulesMenuClose } = useDisclosure();

  // Handle escape key for modules menu
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModulesMenuOpen) {
        onModulesMenuClose();
      }
    };

    if (isModulesMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModulesMenuOpen, onModulesMenuClose]);

  const modules = [
    {
      id: 'monitoring',
      name: 'Monitoreo',
      path: '/monitoring',
      icon: MapPin,
      description: 'Monitoreo GPS en tiempo real',
      hasNavigation: true
    },
    {
      id: 'operativa',
      name: 'Operativa',
      path: '/module3',
      icon: Settings,
      description: 'Gestión operativa',
      hasNavigation: true
    },
    {
      id: 'control',
      name: 'Control y Alertas',
      path: null,
      icon: AlertTriangle,
      description: 'Sistema de control y alertas',
      hasNavigation: false
    },
    {
      id: 'recursos',
      name: 'Gestión de Recursos',
      path: null,
      icon: Users,
      description: 'Administración de recursos',
      hasNavigation: false
    },
    {
      id: 'analytics',
      name: 'Analytics y Reportes',
      path: null,
      icon: TrendingUp,
      description: 'Análisis y reportería',
      hasNavigation: false
    }
  ];

  const handleModuleClick = (module) => {
    if (module.hasNavigation && module.path) {
      navigate(module.path);
      onModulesMenuClose();
    } else {
      // Mostrar toast para módulos sin navegación
      toast({
        title: `${module.name}`,
        description: `${module.description} - Próximamente disponible`,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      onModulesMenuClose();
    }
  };

  const getCurrentModuleName = () => {
    // Incluir dashboard como módulo actual
    if (location.pathname === '/dashboard') {
      return 'Dashboard';
    }
    const currentModule = modules.find(module => module.path === location.pathname);
    return currentModule ? currentModule.name : 'Módulos';
  };

  return (
    <Menu isOpen={isModulesMenuOpen} onOpen={onModulesMenuOpen} onClose={onModulesMenuClose}>
      <MenuButton
        as={Button}
        leftIcon={<Grid3X3 size={16} />}
        rightIcon={<ChevronDown size={14} />}
        colorScheme="blue"
        size="sm"
        variant="solid"
        _hover={{
          bg: 'blue.600',
          transform: 'translateY(-1px)',
          boxShadow: 'lg'
        }}
        _active={{
          transform: 'translateY(0px)',
        }}
        transition="all 0.2s"
      >
        {getCurrentModuleName()}
      </MenuButton>
      <Portal>
        <MenuList
          bg={useColorModeValue('white', '#2f3441')}
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          boxShadow="xl"
          borderRadius="xl"
          p={4}
          minW="420px"
        >
          <Grid templateColumns="repeat(2, 1fr)" gap={3}>
            {modules.map((module, index) => {
              const Icon = module.icon;
              const isCurrentModule = location.pathname === module.path;
              const isDashboardCurrent = location.pathname === '/dashboard';
              
              return (
                <GridItem 
                  key={module.id}
                >
                  <Box
                    as="button"
                    w="100%"
                    h="100px"
                    p={3}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={
                      isCurrentModule 
                        ? useColorModeValue('blue.400', 'blue.500')
                        : useColorModeValue('gray.200', 'gray.600')
                    }
                    bg={
                      isCurrentModule 
                        ? useColorModeValue('blue.50', 'blue.900')
                        : module.hasNavigation 
                          ? useColorModeValue('white', '#35394a')
                          : useColorModeValue('gray.50', '#2a2f3a')
                    }
                    _hover={{
                      bg: useColorModeValue('blue.50', 'blue.900'),
                      borderColor: useColorModeValue('blue.300', 'blue.600'),
                      transform: isCurrentModule ? 'none' : 'translateY(-2px)',
                      boxShadow: isCurrentModule ? 'none' : 'md'
                    }}
                    _active={{
                      transform: 'translateY(0px)'
                    }}
                    transition="all 0.2s"
                    cursor="pointer"
                    onClick={() => handleModuleClick(module)}
                    opacity={isCurrentModule ? 0.9 : (module.hasNavigation ? 1 : 0.7)}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <VStack spacing={2} h="100%" justify="center">
                      <Icon 
                        size={24} 
                        color={
                          isCurrentModule 
                            ? useColorModeValue('#3182CE', '#63B3ED')
                            : module.hasNavigation
                              ? useColorModeValue('#4A90E2', '#63B3ED')
                              : useColorModeValue('#A0ADB8', '#718096')
                        } 
                      />
                      <Box textAlign="center">
                        <Text 
                          fontSize="sm" 
                          fontWeight="medium" 
                          color={
                            isCurrentModule
                              ? useColorModeValue('blue.700', 'blue.200')
                              : module.hasNavigation
                                ? useColorModeValue('gray.700', '#e2e8f0')
                                : useColorModeValue('gray.500', '#718096')
                          }
                          lineHeight="1.2"
                          noOfLines={2}
                        >
                          {module.name}
                        </Text>
                        {isCurrentModule && (
                          <Text fontSize="xs" color="blue.500" mt={1}>
                            (Actual)
                          </Text>
                        )}
                        {!module.hasNavigation && (
                          <Text fontSize="xs" color="gray.400" mt={1}>
                            Próximamente
                          </Text>
                        )}
                      </Box>
                    </VStack>
                  </Box>
                </GridItem>
              );
            })}
          </Grid>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default ModulesMenu;