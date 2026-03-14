import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  useEffect(() => {
    // Simular carga inicial de autenticación
    // En Fase 2 aquí irá: verificar sesión guardada en AsyncStorage
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const login = async (email, password) => {
    // Aquí iría la lógica de autenticación con BD local
    setUser({ email, id: '1' });
  };

  const register = async (email, password) => {
    // Aquí iría la lógica de registro con BD local
    setUser({ email, id: '1' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};
