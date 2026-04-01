import React, { useContext } from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../utils/AuthContext';
import { getTheme } from '../utils/theme';

// Screens
import PacientesListadoScreen from '../screens/Pacientes/PacientesListadoScreen';
import CrearPacienteScreen from '../screens/Pacientes/CrearPacienteScreen';
import EditarPacienteScreen from '../screens/Pacientes/EditarPacienteScreen';
import PacienteFichaScreen from '../screens/Pacientes/PacienteFichaScreen';

import CitasListadoScreen from '../screens/Citas/CitasListadoScreen';
import CrearCitaScreen from '../screens/Citas/CrearCitaScreen';
import EditarCitaScreen from '../screens/Citas/EditarCitaScreen';
import DoctoresListadoScreen from '../screens/Doctores/DoctoresListadoScreen';
import CrearDoctorScreen from '../screens/Doctores/CrearDoctorScreen';

import NotasScreen from '../screens/Notas/NotasScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';
import ConfiguracionScreen from '../screens/Configuracion/ConfiguracionScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack de Pacientes
function PacientesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4F46E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="PacientesListado"
        component={PacientesListadoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CrearPaciente"
        component={CrearPacienteScreen}
        options={{ title: 'Nuevo Paciente' }}
      />
      <Stack.Screen
        name="EditarPaciente"
        component={EditarPacienteScreen}
        options={{ title: 'Editar Paciente' }}
      />
      <Stack.Screen
        name="PacienteFicha"
        component={PacienteFichaScreen}
        options={({ route }) => ({
          title: route.params?.paciente?.nombre || 'Ficha del Paciente',
        })}
      />
      <Stack.Screen
        name="CrearCita"
        component={CrearCitaScreen}
        options={{ title: 'Agendar Cita' }}
      />
      <Stack.Screen
        name="Notas"
        component={NotasScreen}
        options={{ title: 'Notas Médicas' }}
      />
    </Stack.Navigator>
  );
}

// Stack de Citas
function CitasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4F46E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="CitasListado"
        component={CitasListadoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CrearCita"
        component={CrearCitaScreen}
        options={{ title: 'Nueva Cita' }}
      />
      <Stack.Screen
        name="EditarCita"
        component={EditarCitaScreen}
        options={{ title: 'Editar Cita' }}
      />
    </Stack.Navigator>
  );
}

// Stack de Perfil
function PerfilStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4F46E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="PerfilScreen"
        component={PerfilScreen}
        options={{ title: 'Mi Perfil', headerShown: false }}
      />
      <Stack.Screen
        name="Configuracion"
        component={ConfiguracionScreen}
        options={{ title: 'Configuración' }}
      />
    </Stack.Navigator>
  );
}

function DoctoresStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4F46E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="DoctoresListado"
        component={DoctoresListadoScreen}
        options={{ title: 'Doctores', headerShown: false }}
      />
      <Stack.Screen
        name="CrearDoctor"
        component={CrearDoctorScreen}
        options={{ title: 'Nuevo Doctor' }}
      />
    </Stack.Navigator>
  );
}

// Main Navigation con Bottom Tabs
export default function MainNavigator() {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: theme.sub,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="PacientesTab"
        component={PacientesStack}
        options={{
          title: 'Pacientes',
          tabBarLabel: 'Pacientes',
          tabBarIcon: ({ color }) => <TabIcon icon="👥" color={color} />,
        }}
      />
      <Tab.Screen
        name="CitasTab"
        component={CitasStack}
        options={{
          title: 'Citas',
          tabBarLabel: 'Citas',
          tabBarIcon: ({ color }) => <TabIcon icon="📅" color={color} />,
        }}
      />
      <Tab.Screen
        name="DoctoresTab"
        component={DoctoresStack}
        options={{
          title: 'Doctores',
          tabBarLabel: 'Doctores',
          tabBarIcon: ({ color }) => <TabIcon icon="🩺" color={color} />,
        }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilStack}
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ icon, color }) {
  return <Text style={{ fontSize: 20, color }}>{icon}</Text>;
}
