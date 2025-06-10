import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  useToast,
  Image,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel,
  useColorModeValue,
  Container,
  Icon
} from '@chakra-ui/react';
import { User, Lock, Bus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { login } = useAuth();

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, indigo.100, purple.50)',
    'linear(to-br, gray.900, blue.900, purple.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(credentials.username, credentials.password);
      toast({
        title: '¡Bienvenido!',
        description: 'Acceso autorizado al sistema de monitoreo',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error de autenticación',
        description: error.message || 'Usuario o contraseña incorrectos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={bgGradient}
      position="relative"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        opacity="0.05"
        backgroundImage={`
          radial-gradient(circle at 25% 25%, #3182ce 2px, transparent 2px),
          radial-gradient(circle at 75% 75%, #805ad5 2px, transparent 2px)
        `}
        backgroundSize="100px 100px"
        backgroundPosition="0 0, 50px 50px"
      />

      <Container maxW="md" position="relative">
        <Box
          bg={cardBg}
          p={8}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="2xl"
          backdropFilter="blur(10px)"
          position="relative"
        >
          {/* Header */}
          <VStack spacing={6} mb={8}>
            <Flex align="center" justify="center">
              <Box
                p={3}
                bg="primary.500"
                borderRadius="xl"
                color="white"
                mr={3}
              >
                <Bus size={32} />
              </Box>
              <VStack spacing={0} align="start">
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  GPS Fleet
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Sistema de Monitoreo
                </Text>
              </VStack>
            </Flex>
            
            <Box textAlign="center">
              <Text fontSize="lg" fontWeight="600" color="gray.700" mb={1}>
                Bienvenido de vuelta
              </Text>
              <Text fontSize="sm" color="gray.500">
                Ingresa tus credenciales para acceder al dashboard
              </Text>
            </Box>
          </VStack>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.600" fontWeight="500">
                  Usuario
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={User} color="gray.400" w={5} h={5} />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={credentials.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    bg="gray.50"
                    _hover={{ borderColor: 'primary.300', bg: 'white' }}
                    _focus={{ 
                      borderColor: 'primary.500', 
                      bg: 'white',
                      boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)'
                    }}
                    pl={12}
                    h={12}
                    fontSize="sm"
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" color="gray.600" fontWeight="500">
                  Contraseña
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={Lock} color="gray.400" w={5} h={5} />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="gray.200"
                    bg="gray.50"
                    _hover={{ borderColor: 'primary.300', bg: 'white' }}
                    _focus={{ 
                      borderColor: 'primary.500', 
                      bg: 'white',
                      boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)'
                    }}
                    pl={12}
                    h={12}
                    fontSize="sm"
                  />
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                w="100%"
                h={12}
                borderRadius="xl"
                fontSize="sm"
                fontWeight="600"
                isLoading={isLoading}
                loadingText="Verificando..."
                bg="primary.500"
                _hover={{ bg: 'primary.600', transform: 'translateY(-1px)' }}
                _active={{ transform: 'translateY(0)' }}
                boxShadow="lg"
                transition="all 0.2s"
              >
                Iniciar Sesión
              </Button>
            </VStack>
          </form>

          {/* Demo Info */}
          <Box
            mt={6}
            p={4}
            bg="blue.50"
            borderRadius="xl"
            border="1px solid"
            borderColor="blue.200"
          >
            <Text fontSize="xs" color="blue.700" fontWeight="500" mb={1}>
              💡 Credenciales de demo:
            </Text>
            <HStack spacing={4} fontSize="xs" color="blue.600">
              <Text>Usuario: <Text as="span" fontWeight="bold">admin</Text></Text>
              <Text>Clave: <Text as="span" fontWeight="bold">admin</Text></Text>
            </HStack>
          </Box>

          {/* Footer */}
          <Text
            textAlign="center"
            fontSize="xs"
            color="gray.500"
            mt={6}
          >
            © 2024 GPS Fleet Monitoring System
          </Text>
        </Box>
      </Container>
    </Flex>
  );
};

export default Login;