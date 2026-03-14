import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';

export default function CrearPacienteScreen({ navigation }) {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [alergias, setAlergias] = useState('');

  const handleCrear = () => {
    // Aquí iría la lógica para guardar en BD local
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.form, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Nombre Completo</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Ej: Juan Pérez García"
          placeholderTextColor={theme.sub}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={[styles.label, { color: theme.text }]}>Edad</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Ej: 35"
          placeholderTextColor={theme.sub}
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { color: theme.text }]}>Teléfono</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Ej: 123456789"
          placeholderTextColor={theme.sub}
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <Text style={[styles.label, { color: theme.text }]}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Ej: juan@email.com"
          placeholderTextColor={theme.sub}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={[styles.label, { color: theme.text }]}>Alergias</Text>
        <TextInput
          style={[styles.input, styles.textarea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Describa las alergias conocidas"
          placeholderTextColor={theme.sub}
          value={alergias}
          onChangeText={setAlergias}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleCrear}>
          <Text style={styles.submitButtonText}>Crear Paciente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textarea: {
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
