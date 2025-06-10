import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Settings, 
  ChevronDown, 
  Users,
  Truck,
  Route
} from 'lucide-react';

const ResourcesModulesMenu = ({ activeSubModule, onSubModuleChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const resourcesModules = [
    {
      id: 'personal',
      name: 'Personal',
      icon: Users,
      description: 'Gestión de conductores y personal'
    },
    {
      id: 'flota',
      name: 'Flota',
      icon: Truck,
      description: 'Gestión de vehículos'
    },
    {
      id: 'rutas',
      name: 'Rutas',
      icon: Route,
      description: 'Gestión de rutas de transporte'
    }
  ];

  const handleModuleClick = (module) => {
    // Navigate to dedicated pages
    const routeMap = {
      'personal': '/resources/personal',
      'flota': '/resources/flota',
      'rutas': '/resources/rutas'
    };
    
    const targetRoute = routeMap[module.id];
    if (targetRoute) {
      navigate(targetRoute);
    } else {
      // Fallback to old behavior for compatibility
      onSubModuleChange && onSubModuleChange(module.id);
    }
    
    onModulesMenuClose();
    toast({
      title: `Módulo cambiado`,
      description: `Cambiando a ${module.name}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top'
    });
  };

  const getCurrentModuleName = () => {
    const currentModule = resourcesModules.find(module => module.id === activeSubModule);
    return currentModule ? currentModule.name : 'Recursos';
  };

  return (
    <Menu isOpen={isModulesMenuOpen} onOpen={onModulesMenuOpen} onClose={onModulesMenuClose}>
      <MenuButton
        as={Button}
        leftIcon={<Settings size={16} />}
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
            {resourcesModules.map((module) => {
              const Icon = module.icon;
              const isCurrentModule = activeSubModule === module.id;
              
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
                        : useColorModeValue('white', '#35394a')
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
                    opacity={isCurrentModule ? 0.9 : 1}
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
                            : useColorModeValue('#4A90E2', '#63B3ED')
                        } 
                      />
                      <Box textAlign="center">
                        <Text 
                          fontSize="sm" 
                          fontWeight="medium" 
                          color={
                            isCurrentModule
                              ? useColorModeValue('blue.700', 'blue.200')
                              : useColorModeValue('gray.700', '#e2e8f0')
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

export default ResourcesModulesMenu;