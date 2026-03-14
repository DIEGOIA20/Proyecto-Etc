import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';

export default function PerfilScreen({ navigation }) {
  const { user, logout, darkMode, toggleDarkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [telefono, setTelefono] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleGuardarCambios = () => {
    // Aquí iría la lógica para guardar cambios en BD local
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.userName}>{user?.email || 'Usuario'}</Text>
      </View>

      <View style={[styles.form, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.title }]}>Apariencia</Text>
        <View style={styles.settingRow}>
          <View>
            <Text style={[styles.label, { color: theme.text }]}>Modo Oscuro</Text>
            <Text style={[styles.settingDesc, { color: theme.sub }]}>Cambiar el tema de la aplicación</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
            thumbColor={darkMode ? '#4F46E5' : '#F3F4F6'}
          />
        </View>
      </View>

      <View style={[styles.form, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.title }]}>Mi Perfil</Text>

        <Text style={[styles.label, { color: theme.text }]}>Nombre Completo</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Ingrese su nombre completo"
          placeholderTextColor={theme.sub}
          value={nombreCompleto}
          onChangeText={setNombreCompleto}
          editable={isEditing}
        />

        <Text style={[styles.label, { color: theme.text }]}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Correo electrónico"
          placeholderTextColor={theme.sub}
          value={email}
          onChangeText={setEmail}
          editable={isEditing}
          keyboardType="email-address"
        />

        <Text style={[styles.label, { color: theme.text }]}>Teléfono</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Teléfono"
          placeholderTextColor={theme.sub}
          value={telefono}
          onChangeText={setTelefono}
          editable={isEditing}
          keyboardType="phone-pad"
        />

        <Text style={[styles.label, { color: theme.text }]}>Especialidad/Rol</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Ej: Médico General"
          placeholderTextColor={theme.sub}
          value={especialidad}
          onChangeText={setEspecialidad}
          editable={isEditing}
        />

        {!isEditing ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleGuardarCambios}
            >
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={[styles.form, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.title }]}>Seguridad</Text>
        <TouchableOpacity style={styles.changePasswordButton}>
          <Text style={styles.buttonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.form, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  form: {
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: '#9CA3AF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  changePasswordButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
