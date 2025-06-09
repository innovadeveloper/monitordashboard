import React from 'react';
import { Grid, Box, HStack, Button, Text } from '@chakra-ui/react';
import { Map, Video } from 'lucide-react';
import VideoPanel from './VideoPanel';

const VideoGrid = ({ panels, onBusDrop, onPanelClose }) => {
  return (
    <Box p={4} h="full">
      {/* Tab Navigation */}
      <HStack spacing={4} mb={4}>
        <Button
          leftIcon={<Map size={16} />}
          variant="ghost"
          color="blue.500"
          borderBottom="2px"
          borderColor="blue.500"
          borderRadius="none"
          pb={2}
        >
          Mapa Central
        </Button>
        <Button
          leftIcon={<Video size={16} />}
          variant="ghost"
          color="gray.600"
          _hover={{ color: 'blue.500' }}
        >
          Video Digital
        </Button>
      </HStack>

      {/* Video Grid */}
      <Grid templateColumns="1fr 1fr" gap={4} h="calc(100% - 60px)">
        {panels.map((panel) => (
          <VideoPanel
            key={panel.id}
            panel={panel}
            onBusDrop={onBusDrop}
            onClose={onPanelClose}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default VideoGrid;