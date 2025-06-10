import React from 'react';
import {
  Flex,
  HStack,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  IconButton,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import { 
  Sun, 
  Moon, 
  User, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ModulesMenu from './ModulesMenu';

const TopBar = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  // Color mode values
  const headerBg = useColorModeValue('app.surface.header', 'app.surface.header');

  return (
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

        {/* Modules Menu */}
        <ModulesMenu />
        
        {/* User Menu */}
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
  );
};

export default TopBar;