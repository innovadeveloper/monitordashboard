// src/components/ViewModeSelector.jsx
import React from 'react';
import {
  HStack,
  IconButton,
  Tooltip,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { Grid, Square, LayoutGrid } from 'lucide-react';


const ViewModeSelector = ({ 
  currentMode = '2x2', 
  onModeChange 
}) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const modes = [
    {
      id: '2x2',
      icon: <Grid size={16} />,
      tooltip: 'Vista cuádruple (2x2)',
      label: '2×2'
    },
    {
      id: '2x1',
      icon: <LayoutGrid size={16} />,
      tooltip: 'Vista dual horizontal (2x1)',
      label: '2×1'
    },
    {
      id: '1x1',
      icon: <Square size={16} />,
      tooltip: 'Vista única (1x1)',
      label: '1×1'
    }
  ];

  return (
    <HStack spacing={0}>
      <Divider 
        orientation="vertical" 
        height="30px" 
        borderColor="gray.300" 
        mx={3} 
      />
      
      <HStack 
        spacing={1}
        bg={bgColor}
        borderRadius="8px"
        p={1}
        border="1px solid"
        borderColor={borderColor}
      >
        {modes.map((mode) => (
          <Tooltip 
            key={mode.id} 
            label={mode.tooltip} 
            placement="bottom"
            hasArrow
          >
            <IconButton
              aria-label={mode.tooltip}
              icon={mode.icon}
              size="sm"
              variant={currentMode === mode.id ? 'solid' : 'ghost'}
              colorScheme={currentMode === mode.id ? 'primary' : 'gray'}
              onClick={() => onModeChange?.(mode.id)}
              borderRadius="6px"
              minW="32px"
              h="32px"
              fontSize="14px"
              transition="all 0.2s"
              _hover={{
                transform: currentMode !== mode.id ? 'scale(1.05)' : 'none',
              }}
            />
          </Tooltip>
        ))}
      </HStack>
    </HStack>
  );
};

export default ViewModeSelector;