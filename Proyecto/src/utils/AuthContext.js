import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initDatabase,
  loginUser,
  registerUser,
  getSettings,
  updateSetting,
  getUserById,
  updateUserProfile,
  changeUserPassword,
} from './database';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    notificationsCitas: true,
    notificationsNotas: true,
    reminderWindow: '24h',
  });

  const SESSION_KEY = 'medicitas.session.userId';

  const toggleDarkMode = async () => {
    const next = !darkMode;
    setDarkMode(next);
    await updateSetting('darkMode', next);
  };

  const updateAppSettings = async (partial) => {
    const nextSettings = {
      ...settings,
      ...partial,
    };

    setSettings(nextSettings);

    if (Object.prototype.hasOwnProperty.call(partial, 'notificationsCitas')) {
      await updateSetting('notificationsCitas', nextSettings.notificationsCitas);
    }
    if (Object.prototype.hasOwnProperty.call(partial, 'notificationsNotas')) {
      await updateSetting('notificationsNotas', nextSettings.notificationsNotas);
    }
    if (Object.prototype.hasOwnProperty.call(partial, 'reminderWindow')) {
      await updateSetting('reminderWindow', nextSettings.reminderWindow);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initDatabase();

        const dbSettings = await getSettings();
        setDarkMode(dbSettings.darkMode);
        setSettings({
          notificationsCitas: dbSettings.notificationsCitas,
          notificationsNotas: dbSettings.notificationsNotas,
          reminderWindow: dbSettings.reminderWindow,
        });

        const storedUserId = await AsyncStorage.getItem(SESSION_KEY);
        if (storedUserId) {
          const dbUser = await getUserById(Number(storedUserId));
          if (dbUser) {
            setUser(dbUser);
          }
        }
      } catch (error) {
        console.warn('Error inicializando app (puede ser normal en web):', error.message);
        // En web o si hay problemas con SQLite, continuamos sin BD inicialmente
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (email, password) => {
    const loggedUser = await loginUser(email, password);
    setUser(loggedUser);
    await AsyncStorage.setItem(SESSION_KEY, String(loggedUser.id));
  };

  const register = async (email, password) => {
    const created = await registerUser(email, password);
    const createdUser = await getUserById(created.id);
    setUser(createdUser);
    await AsyncStorage.setItem(SESSION_KEY, String(createdUser.id));
  };

  const saveProfile = async (profileData) => {
    if (!user?.id) {
      return;
    }
    const updated = await updateUserProfile(user.id, profileData);
    setUser(updated);
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user?.id) {
      return;
    }
    await changeUserPassword(user.id, currentPassword, newPassword);
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        darkMode,
        toggleDarkMode,
        settings,
        updateAppSettings,
        saveProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
