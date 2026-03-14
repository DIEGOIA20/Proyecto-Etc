import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);

  const handleLogin = async () => {
    if (email && password) {
      await login(email, password);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={styles.title}>MediCitas</Text>
      <Text style={[styles.subtitle, { color: theme.sub }]}>Gestión de Pacientes y Citas</Text>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Correo Electrónico"
          placeholderTextColor={theme.sub}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Contraseña"
          placeholderTextColor={theme.sub}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#4F46E5',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});
