import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';

export default function PerfilScreen({ navigation }) {
  const { user, logout, darkMode, toggleDarkMode, saveProfile, changePassword } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const [nombreCompleto, setNombreCompleto] = useState(user?.nombreCompleto || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [especialidad, setEspecialidad] = useState(user?.especialidad || '');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleGuardarCambios = async () => {
    try {
      await saveProfile({ nombreCompleto, telefono, especialidad });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el perfil.');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Campos requeridos', 'Completa todos los campos de contraseña.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Contraseña débil', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('No coincide', 'La confirmación debe coincidir con la nueva contraseña.');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      Alert.alert('Éxito', 'Tu contraseña fue actualizada.');
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo cambiar la contraseña.');
    }
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
        {!isChangingPassword ? (
          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={() => setIsChangingPassword(true)}
          >
            <Text style={styles.buttonText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={[styles.label, { color: theme.text }]}>Contraseña Actual</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
              placeholder="Contraseña actual"
              placeholderTextColor={theme.sub}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />

            <Text style={[styles.label, { color: theme.text }]}>Nueva Contraseña</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
              placeholder="Nueva contraseña"
              placeholderTextColor={theme.sub}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <Text style={[styles.label, { color: theme.text }]}>Confirmar Nueva Contraseña</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
              placeholder="Confirmar nueva contraseña"
              placeholderTextColor={theme.sub}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Guardar Nueva Contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsChangingPassword(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
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
