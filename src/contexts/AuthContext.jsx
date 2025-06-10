import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const savedAuth = localStorage.getItem('gps-fleet-auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(true);
        setUser(authData.user);
      } catch (error) {
        localStorage.removeItem('gps-fleet-auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username, password) => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (username === 'admin' && password === 'admin') {
          const userData = {
            id: 1,
            username: 'admin',
            name: 'Administrador',
            role: 'admin',
            lastLogin: new Date().toISOString()
          };

          setIsAuthenticated(true);
          setUser(userData);

          // Save to localStorage
          localStorage.setItem('gps-fleet-auth', JSON.stringify({
            user: userData,
            timestamp: Date.now()
          }));

          resolve(userData);
        } else {
          reject(new Error('Credenciales incorrectas'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('gps-fleet-auth');
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};