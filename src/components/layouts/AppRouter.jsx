import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, MonitoringDashboard, Module3, TrackPlayerPage, AlertPlayerPage, ResourceManagementPage, PersonalManagementPage, FleetManagementPage, RouteManagementPage } from '../views';

const AppRouter = () => {
  return (
    <Routes>
      {/* Default route redirects to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Main routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/monitoring" element={<MonitoringDashboard />} />
      <Route path="/trackplayer" element={<TrackPlayerPage />} />
      <Route path="/alerts" element={<AlertPlayerPage />} />
      <Route path="/resources" element={<ResourceManagementPage />} />
      <Route path="/resources/personal" element={<PersonalManagementPage />} />
      <Route path="/resources/flota" element={<FleetManagementPage />} />
      <Route path="/resources/rutas" element={<RouteManagementPage />} />
      <Route path="/module3" element={<Module3 />} />
      
      {/* Catch all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;