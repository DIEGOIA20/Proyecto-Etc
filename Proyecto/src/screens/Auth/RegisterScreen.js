import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);

  const handleRegister = async () => {
    if (email && password && password === confirmPassword) {
      await register(email, password);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Volver</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.title }]}>Crear Cuenta</Text>

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
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Confirmar Contraseña"
          placeholderTextColor={theme.sub}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
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
  backButton: {
    color: '#4F46E5',
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
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
});
