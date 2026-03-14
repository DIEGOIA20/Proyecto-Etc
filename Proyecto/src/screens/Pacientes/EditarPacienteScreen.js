import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';

export default function EditarPacienteScreen({ route, navigation }) {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const { paciente } = route.params;
  const [nombre, setNombre] = useState(paciente?.nombre || '');
  const [edad, setEdad] = useState(paciente?.edad?.toString() || '');
  const [telefono, setTelefono] = useState(paciente?.telefono || '');
  const [email, setEmail] = useState('');
  const [alergias, setAlergias] = useState('');

  const handleActualizar = () => {
    // Aquí iría la lógica para actualizar en BD local
    navigation.goBack();
  };

  const handleEliminar = () => {
    // Aquí iría la lógica para eliminar de BD local
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.form, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Nombre Completo</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={[styles.label, { color: theme.text }]}>Edad</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { color: theme.text }]}>Teléfono</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <Text style={[styles.label, { color: theme.text }]}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={[styles.label, { color: theme.text }]}>Alergias</Text>
        <TextInput
          style={[styles.input, styles.textarea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={alergias}
          onChangeText={setAlergias}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleActualizar}>
          <Text style={styles.submitButtonText}>Actualizar Paciente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleEliminar}>
          <Text style={styles.deleteButtonText}>Eliminar Paciente</Text>
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
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
