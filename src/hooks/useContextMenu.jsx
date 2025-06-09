// src/hooks/useContextMenu.js
import { useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState(null);
  const [playingPanels, setPlayingPanels] = useState(new Set([1, 2, 3, 4]));
  const [mutedPanels, setMutedPanels] = useState(new Set());
  const toast = useToast();

  const openContextMenu = useCallback((event, panelData) => {
    event.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      panelData
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handlePlay = useCallback(() => {
    if (contextMenu?.panelData) {
      setPlayingPanels(prev => new Set([...prev, contextMenu.panelData.id]));
      toast({
        title: 'Reproducción iniciada',
        description: `Panel ${contextMenu.panelData.id}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  }, [contextMenu, toast]);

  const handlePause = useCallback(() => {
    if (contextMenu?.panelData) {
      setPlayingPanels(prev => {
        const newSet = new Set(prev);
        newSet.delete(contextMenu.panelData.id);
        return newSet;
      });
      toast({
        title: 'Reproducción pausada',
        description: `Panel ${contextMenu.panelData.id}`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  }, [contextMenu, toast]);

  const handleMute = useCallback(() => {
    if (contextMenu?.panelData) {
      setMutedPanels(prev => new Set([...prev, contextMenu.panelData.id]));
      toast({
        title: 'Audio silenciado',
        description: `Panel ${contextMenu.panelData.id}`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  }, [contextMenu, toast]);

  const handleUnmute = useCallback(() => {
    if (contextMenu?.panelData) {
      setMutedPanels(prev => {
        const newSet = new Set(prev);
        newSet.delete(contextMenu.panelData.id);
        return newSet;
      });
      toast({
        title: 'Audio activado',
        description: `Panel ${contextMenu.panelData.id}`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  }, [contextMenu, toast]);

  const handleCapture = useCallback(() => {
    if (contextMenu?.panelData) {
      toast({
        title: 'Captura tomada',
        description: `${contextMenu.panelData.bus?.id} - ${contextMenu.panelData.cameraType}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [contextMenu, toast]);

  const handleZoom = useCallback(() => {
    if (contextMenu?.panelData) {
      toast({
        title: 'Zoom activado',
        description: 'Use la rueda del mouse para ajustar el zoom',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [contextMenu, toast]);

  const handleFullscreen = useCallback(() => {
    if (contextMenu?.panelData) {
      toast({
        title: 'Pantalla completa',
        description: `Panel ${contextMenu.panelData.id} en pantalla completa`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  }, [contextMenu, toast]);

  const handleSettings = useCallback(() => {
    if (contextMenu?.panelData) {
      toast({
        title: 'Configuración',
        description: 'Abriendo configuración de cámara...',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  }, [contextMenu, toast]);

  const handlePlayStateChange = useCallback((panelId, isPlaying) => {
    if (isPlaying) {
      setPlayingPanels(prev => new Set([...prev, panelId]));
    } else {
      setPlayingPanels(prev => {
        const newSet = new Set(prev);
        newSet.delete(panelId);
        return newSet;
      });
    }
  }, []);

  const handleMuteStateChange = useCallback((panelId, isMuted) => {
    if (isMuted) {
      setMutedPanels(prev => new Set([...prev, panelId]));
    } else {
      setMutedPanels(prev => {
        const newSet = new Set(prev);
        newSet.delete(panelId);
        return newSet;
      });
    }
  }, []);

  return {
    contextMenu,
    playingPanels,
    mutedPanels,
    openContextMenu,
    closeContextMenu,
    handlers: {
      handlePlay,
      handlePause,
      handleMute,
      handleUnmute,
      handleCapture,
      handleZoom,
      handleFullscreen,
      handleSettings,
      handlePlayStateChange,
      handleMuteStateChange,
    }
  };
};